// code adapted from https://github.com/habaneroofdoom/AltNetRop

using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Infrastructure
{
    public class Result<TSuccess, TFailure> : Result
	{
	    public TSuccess Success { get; protected set; }
		public TFailure Failure { get; protected set; }

		protected Result()
		{
		}

        public static Result<TSuccess, TFailure> Succeeded(TSuccess success)
		{
			if (success == null) throw new ArgumentNullException(nameof(success));
			
			return new Result<TSuccess, TFailure>
			{
				IsSuccessful = true,
				Success = success
			};
		}

		public static Result<TSuccess, TFailure> Failed(TFailure failure)
		{
			if (failure == null) throw new ArgumentNullException(nameof(failure));
			
			return new Result<TSuccess, TFailure>
			{
				IsSuccessful = false,
				Failure = failure
			};
		}
	}

    public class Result<T> : Result<T, string> 
    {
        public static new Result<T> Succeeded(T success)
		{
			if (success == null) throw new ArgumentNullException(nameof(success));
			
			return new Result<T>
			{
				IsSuccessful = true,
				Success = success
			};
		}

		public static new Result<T> Failed(string failure)
		{
			if (failure == null) throw new ArgumentNullException(nameof(failure));
			
			return new Result<T>
			{
				IsSuccessful = false,
				Failure = failure
			};
		}
    }

    public class Result 
    {
        public bool IsSuccess => IsSuccessful;
	    public bool IsFailure => !IsSuccessful;
		protected bool IsSuccessful { get; set; }

        public static Result<T> Succeeded<T>(T success)
        {
            return Result<T>.Succeeded(success);
        }

        public static Result<T> Failed<T>(string failure)
        {
            return Result<T>.Failed(failure);
        }
    }

    public static class ResultExtensions
    {
        public static void Handle<TSuccess, TFailure>(this Result<TSuccess, TFailure> result,
            Action<TSuccess> onSuccess,
            Action<TFailure> onFailure)
        {
            if (result.IsSuccess)
                onSuccess(result.Success);
            else
                onFailure(result.Failure);
        }

        public static async Task Handle<TSuccess, TFailure>(this Result<TSuccess, TFailure> result,
            Func<TSuccess, Task> onSuccess,
            Func<TFailure, Task> onFailure)
        {
            if (result.IsSuccess)
                await onSuccess(result.Success);
            else
                await onFailure(result.Failure);
        }

        public static Result<TSuccess2, TFailure2> Either<TSuccess, TFailure, TSuccess2, TFailure2>(
            this Result<TSuccess, TFailure> x,
            Func<Result<TSuccess, TFailure>, Result<TSuccess2, TFailure2>> onSuccess,
            Func<Result<TSuccess, TFailure>, Result<TSuccess2, TFailure2>> onFailure)
        {
            return x.IsSuccess ? onSuccess(x) : onFailure(x);
        }

        public static async Task<Result<TSuccess2, TFailure2>> Either<TSuccess, TFailure, TSuccess2, TFailure2>(
            this Result<TSuccess, TFailure> x,
            Func<Result<TSuccess, TFailure>, Task<Result<TSuccess2, TFailure2>>> onSuccess,
            Func<Result<TSuccess, TFailure>, Task<Result<TSuccess2, TFailure2>>> onFailure)
        {
            return x.IsSuccess ? await onSuccess(x) : await onFailure(x);
        }

        public static async Task<Result<TSuccess2, TFailure2>> Either<TSuccess, TFailure, TSuccess2, TFailure2>(
            this Result<TSuccess, TFailure> x,
            Func<Result<TSuccess, TFailure>, Task<Result<TSuccess2, TFailure2>>> onSuccess,
            Func<Result<TSuccess, TFailure>, Result<TSuccess2, TFailure2>> onFailure)
        {
            return x.IsSuccess ? await onSuccess(x) : onFailure(x);
        }

        // Whatever x is, make it a failure.
        // The trick is that failure is an array type, can it can be made an empty array failure.
        public static Result<TSuccess, TFailure[]> ToFailure<TSuccess, TFailure>(
            this Result<TSuccess, TFailure[]> x)
        {
            return x.Either(
                a => Result<TSuccess, TFailure[]>.Failed(new TFailure[0]),
                b => b
                );
        }

        // Put accumulator and next together.
        // If they are both successes, then put them together as a success.
        // If either/both are failures, then put them together as a failure.
        // Because success and failure is an array, they can be put together
        public static Result<TSuccess[], TFailure[]> Merge<TSuccess, TFailure>(
            this Result<TSuccess[], TFailure[]> accumulator,
            Result<TSuccess, TFailure[]> next)
        {
            if (accumulator.IsSuccess && next.IsSuccess)
            {
                return Result<TSuccess[], TFailure[]>
                    .Succeeded(accumulator.Success.Concat(new List<TSuccess>() { next.Success })
                        .ToArray());
            }
            return Result<TSuccess[], TFailure[]>
                .Failed(accumulator.Failure.Concat(next.ToFailure().Failure).ToArray());
        }


        public static Result<TSuccess[]> Merge<TSuccess>(
            this Result<TSuccess[]> accumulator,
            Result<TSuccess> next)
        {
            if (accumulator.IsSuccess && next.IsSuccess)
            {
                return Result<TSuccess[]>
                    .Succeeded(accumulator.Success.Concat(new List<TSuccess>() { next.Success })
                        .ToArray());
            }
            return Result<TSuccess[]>.Failed(accumulator.Failure + "\n" + next.Failure);
        }

        // Aggregate an array of results together.
        // If any of the results fail, return combined failures
        // Will only return success if all results succeed
        public static Result<TSuccess[], TFailure[]> Aggregate<TSuccess, TFailure>(
            this IEnumerable<Result<TSuccess, TFailure[]>> accumulator)
        {
            var emptySuccess = Result<TSuccess[], TFailure[]>.Succeeded(new TSuccess[0]);
            return accumulator.Aggregate(emptySuccess, (acc, o) => acc.Merge(o));
        }

        public static async Task<Result<TSuccess[], TFailure[]>> Aggregate<TSuccess, TFailure>(
            this IEnumerable<Task<Result<TSuccess, TFailure[]>>> accumulator)
        {
            var emptySuccess = Result<TSuccess[], TFailure[]>.Succeeded(new TSuccess[0]);
            return (await Task.WhenAll(accumulator))
                .Aggregate(emptySuccess, (acc, o) => acc.Merge(o));
        }

        public static Result<TSuccess[]> Aggregate<TSuccess>(
            this IEnumerable<Result<TSuccess>> accumulator)
        {
            var emptySuccess = Result<TSuccess[]>.Succeeded(new TSuccess[0]);
            return accumulator.Aggregate(emptySuccess, (acc, o) => acc.Merge(o));
        }

        public static async Task<Result<TSuccess[]>> Aggregate<TSuccess>(
            this IEnumerable<Task<Result<TSuccess>>> accumulator)
        {
            var emptySuccess = Result<TSuccess[]>.Succeeded(new TSuccess[0]);
            return (await Task.WhenAll(accumulator))
                .Aggregate(emptySuccess, (acc, o) => acc.Merge(o));
        }

        // Map: functional map
        // if x is a a success call f, otherwise pass it through as a failure
        public static Result<TSuccessNew, TFailure> Map<TSuccess, TFailure, TSuccessNew>(
            this Result<TSuccess, TFailure> x,
            Func<TSuccess, TSuccessNew> f)
        {
            return x.IsSuccess
                ? Result<TSuccessNew, TFailure>.Succeeded(f(x.Success))
                : Result<TSuccessNew, TFailure>.Failed(x.Failure);
        }

        public static async Task<Result<TSuccessNew, TFailure>> Map<TSuccess, TFailure, TSuccessNew>(
            this Result<TSuccess, TFailure> x,
            Func<TSuccess, Task<TSuccessNew>> f)
        {
            return x.IsSuccess
                ? Result<TSuccessNew, TFailure>.Succeeded(await f(x.Success))
                : Result<TSuccessNew, TFailure>.Failed(x.Failure);
        }

        // Bind: functional bind
        // Monadize it!
        public static Result<TSuccessNew, TFailure> Bind<TSuccess, TFailure, TSuccessNew>(
            this Result<TSuccess, TFailure> x,
            Func<TSuccess, Result<TSuccessNew, TFailure>> f)
        {
            return x.IsSuccess
                ? f(x.Success)
                : Result<TSuccessNew, TFailure>.Failed(x.Failure);
        }

        public static async Task<Result<TSuccessNew, TFailure>> Bind<TSuccess, TFailure, TSuccessNew>(
            this Result<TSuccess, TFailure> x,
            Func<TSuccess, Task<Result<TSuccessNew, TFailure>>> f)
        {
            return x.IsSuccess
                ? await f(x.Success)
                : Result<TSuccessNew, TFailure>.Failed(x.Failure);
        }

        public static Result<TSuccess, TFailure> Tee<TSuccess, TFailure>(this Result<TSuccess, TFailure> x, Action<TSuccess> f)
        {
            if (x.IsSuccess)
            {
                f(x.Success);
            }

            return x;
        } 

        public static async Task<Result<TSuccess, TFailure>> Tee<TSuccess, TFailure>(
            this Result<TSuccess, TFailure> x, Func<TSuccess, Task> f)
        {
            if (x.IsSuccess)
            {
                await f(x.Success);
            }

            return x;
        }

        public static Result<TSuccessNew> Map<TSuccess, TSuccessNew>(
            this Result<TSuccess> x,
            Func<TSuccess, TSuccessNew> f)
        {
            return x.IsSuccess
                ? Result<TSuccessNew>.Succeeded(f(x.Success))
                : Result<TSuccessNew>.Failed(x.Failure);
        }

        public static async Task<Result<TSuccessNew>> Map<TSuccess, TSuccessNew>(
            this Result<TSuccess> x,
            Func<TSuccess, Task<TSuccessNew>> f)
        {
            return x.IsSuccess
                ? Result<TSuccessNew>.Succeeded(await f(x.Success))
                : Result<TSuccessNew>.Failed(x.Failure);
        }

        // Bind: functional bind
        // Monadize it!
        public static Result<TSuccessNew> Bind<TSuccess, TSuccessNew>(
            this Result<TSuccess> x,
            Func<TSuccess, Result<TSuccessNew>> f)
        {
            return x.IsSuccess
                ? f(x.Success)
                : Result<TSuccessNew>.Failed(x.Failure);
        }

        public static async Task<Result<TSuccessNew>> Bind<TSuccess, TSuccessNew>(
            this Result<TSuccess> x,
            Func<TSuccess, Task<Result<TSuccessNew>>> f)
        {
            return x.IsSuccess
                ? await f(x.Success)
                : Result<TSuccessNew>.Failed(x.Failure);
        }

        public static Result Bind<TSuccess>(
            this Result<TSuccess> x,
            Func<TSuccess, Result> f)
        {
            return x.IsSuccess
                ? f(x.Success)
                : Result<string>.Failed(x.Failure);
        }

        public static async Task<Result> Bind<TSuccess>(
            this Result<TSuccess> x,
            Func<TSuccess, Task<Result>> f)
        {
            return x.IsSuccess
                ? await f(x.Success)
                : Result<string>.Failed(x.Failure);
        }

        public static Result<TSuccess> Bind<TSuccess>(
            this Result x, Func<Result<TSuccess>> f, 
            string failMessage = "Failed to bind")
        {
            return x.IsSuccess
                ? f()
                : Result<TSuccess>.Failed(failMessage);
        }

        public static async Task<Result<TSuccess>> Bind<TSuccess>(
            this Result x, Func<Task<Result<TSuccess>>> f,
            string failMessage = "Failed to bind")
        {
            return x.IsSuccess
                ? await f()
                : Result<TSuccess>.Failed(failMessage);
        }

        public static Result<TSuccess> Tee<TSuccess>(this Result<TSuccess> x, Action<TSuccess> f)
        {
            if (x.IsSuccess)
            {
                f(x.Success);
            }

            return x;
        } 

        public static async Task<Result<TSuccess>> Tee<TSuccess>(
            this Result<TSuccess> x, Func<TSuccess, Task> f)
        {
            if (x.IsSuccess)
            {
                await f(x.Success);
            }

            return x;
        }

        public static Result<T> FirstResult<T>(this IEnumerable<T> lst,
            Func<T, bool> expr)
        {
            try
            {
                return Result.Succeeded(lst.First(expr));
            }
            catch(InvalidOperationException)
            {
                return Result.Failed<T>("Element not found");
            }
        }
    }
}