using System;
using System.Threading.Tasks;

namespace Infrastructure
{

    public class TupleAdder<A>
    {
        public A Value { get; private set; }

        public TupleAdder(A Value)
        {
            this.Value = Value;
        }

        public TupleAdder<(A, B)> Add<B>(B nextValue)
        {
            return new TupleAdder<(A, B)>((Value, nextValue));
        }
    }

    public class TupleAdder<A, B>
    {
        public (A, B) Value { get; private set; }

        public TupleAdder((A, B) Value)
        {
            this.Value = Value;
        }

        public TupleAdder<(A, B, C)> Add<C>(C nextValue)
        {
            return new TupleAdder<(A, B, C)>((Value.Item1, Value.Item2, nextValue));
        }
    }

    public class TupleAdder<A, B, C>
    {
        public (A, B, C) Value { get; private set; }

        public TupleAdder((A, B, C) Value)
        {
            this.Value = Value;
        }

        public TupleAdder<(A, B, C, D)> Add<D>(D nextValue)
        {
            return new TupleAdder<(A, B, C, D)>((Value.Item1, Value.Item2, Value.Item3, nextValue));
        }
    }

    public class TupleAdder<A, B, C, D>
    {
        public (A, B, C, D) Value { get; private set; }

        public TupleAdder((A, B, C, D) Value)
        {
            this.Value = Value;
        }

        public TupleAdder<(A, B, C, D, E)> Add<E>(E nextValue)
        {
            return new TupleAdder<(A, B, C, D, E)>((Value.Item1, Value.Item2, Value.Item3, Value.Item4, nextValue));
        }
    }

    public class TupleAdder<A, B, C, D, E>
    {
        public (A, B, C, D, E) Value { get; private set; }

        public TupleAdder((A, B, C, D, E) Value)
        {
            this.Value = Value;
        }

        public TupleAdder<(A, B, C, D, E, F)> Add<F>(F nextValue)
        {
            return new TupleAdder<(A, B, C, D, E, F)>((Value.Item1, Value.Item2, Value.Item3, Value.Item4, Value.Item5, nextValue));
        }
    }

    public class TupleAdder<A, B, C, D, E, F>
    {
        public (A, B, C, D, E, F) Value { get; private set; }

        public TupleAdder((A, B, C, D, E, F) Value)
        {
            this.Value = Value;
        }

        public TupleAdder<(A, B, C, D, E, F, G)> Add<G>(G nextValue)
        {
            return new TupleAdder<(A, B, C, D, E, F, G)>((Value.Item1, Value.Item2, Value.Item3, Value.Item4, Value.Item5, Value.Item6, nextValue));
        }
    }

    public class TupleAdder<A, B, C, D, E, F, G>
    {
        public (A, B, C, D, E, F, G) Value { get; private set; }

        public TupleAdder((A, B, C, D, E, F, G) Value)
        {
            this.Value = Value;
        }

        public TupleAdder<(A, B, C, D, E, F, G, H)> Add<H>(H nextValue)
        {
            return new TupleAdder<(A, B, C, D, E, F, G, H)>((Value.Item1, Value.Item2, Value.Item3, Value.Item4, Value.Item5, Value.Item6, Value.Item7, nextValue));
        }
    }

    public class TupleAdder<A, B, C, D, E, F, G, H>
    {
        public (A, B, C, D, E, F, G, H) Value { get; private set; }

        public TupleAdder((A, B, C, D, E, F, G, H) Value)
        {
            this.Value = Value;
        }

        public TupleAdder<(A, B, C, D, E, F, G, H, I)> Add<I>(I nextValue)
        {
            return new TupleAdder<(A, B, C, D, E, F, G, H, I)>((Value.Item1, Value.Item2, Value.Item3, Value.Item4, Value.Item5, Value.Item6, Value.Item7, Value.Item8, nextValue));
        }
    }

    public static class TupleResultExtensions
    {

        public static Result<(A, B)> TupleBind<A, B>(this Result<A> x, Func<A, Result<B>> f)
        {
            return x.Bind(y => f(y).Map(z => new TupleAdder<A>(y).Add(z).Value));
        }

        public static Result<(A, B)> TupleMap<A, B>(this Result<A> x, Func<A, B> f)
        {
            return x.Map(y => new TupleAdder<A>(y).Add(f(y)).Value);
        }

        public static async Task<Result<(A, B)>> TupleBind<A, B>(this Result<A> x, Func<A, Task<Result<B>>> f)
        {
            return await x.Bind(async y => (await f(y)).Map(z => new TupleAdder<A>(y).Add(z).Value));
        }

        public static async Task<Result<(A, B)>> TupleMap<A, B>(this Result<A> x, Func<A, Task<B>> f)
        {
            return await x.Map(async y => new TupleAdder<A>(y).Add(await f(y)).Value);
        }

        public static Result<(A, B, C)> TupleBind<A, B, C>(this Result<(A, B)> x, Func<A, B, Result<C>> f)
        {
            return x.Bind(y => f(y.Item1, y.Item2).Map(z => new TupleAdder<A, B>(y).Add(z).Value));
        }

        public static Result<(A, B, C)> TupleMap<A, B, C>(this Result<(A, B)> x, Func<A, B, C> f)
        {
            return x.Map(y => new TupleAdder<A, B>(y).Add(f(y.Item1, y.Item2)).Value);
        }

        public static async Task<Result<(A, B, C)>> TupleBind<A, B, C>(this Result<(A, B)> x, Func<A, B, Task<Result<C>>> f)
        {
            return await x.Bind(async y => (await f(y.Item1, y.Item2)).Map(z => new TupleAdder<A, B>(y).Add(z).Value));
        }

        public static async Task<Result<(A, B, C)>> TupleMap<A, B, C>(this Result<(A, B)> x, Func<A, B, Task<C>> f)
        {
            return await x.Map(async y => new TupleAdder<A, B>(y).Add(await f(y.Item1, y.Item2)).Value);
        }

        public static Result<(A, B, C, D)> TupleBind<A, B, C, D>(this Result<(A, B, C)> x, Func<A, B, C, Result<D>> f)
        {
            return x.Bind(y => f(y.Item1, y.Item2, y.Item3).Map(z => new TupleAdder<A, B, C>(y).Add(z).Value));
        }

        public static Result<(A, B, C, D)> TupleMap<A, B, C, D>(this Result<(A, B, C)> x, Func<A, B, C, D> f)
        {
            return x.Map(y => new TupleAdder<A, B, C>(y).Add(f(y.Item1, y.Item2, y.Item3)).Value);
        }

        public static async Task<Result<(A, B, C, D)>> TupleBind<A, B, C, D>(this Result<(A, B, C)> x, Func<A, B, C, Task<Result<D>>> f)
        {
            return await x.Bind(async y => (await f(y.Item1, y.Item2, y.Item3)).Map(z => new TupleAdder<A, B, C>(y).Add(z).Value));
        }

        public static async Task<Result<(A, B, C, D)>> TupleMap<A, B, C, D>(this Result<(A, B, C)> x, Func<A, B, C, Task<D>> f)
        {
            return await x.Map(async y => new TupleAdder<A, B, C>(y).Add(await f(y.Item1, y.Item2, y.Item3)).Value);
        }

        public static Result<(A, B, C, D, E)> TupleBind<A, B, C, D, E>(this Result<(A, B, C, D)> x, Func<A, B, C, D, Result<E>> f)
        {
            return x.Bind(y => f(y.Item1, y.Item2, y.Item3, y.Item4).Map(z => new TupleAdder<A, B, C, D>(y).Add(z).Value));
        }

        public static Result<(A, B, C, D, E)> TupleMap<A, B, C, D, E>(this Result<(A, B, C, D)> x, Func<A, B, C, D, E> f)
        {
            return x.Map(y => new TupleAdder<A, B, C, D>(y).Add(f(y.Item1, y.Item2, y.Item3, y.Item4)).Value);
        }

        public static async Task<Result<(A, B, C, D, E)>> TupleBind<A, B, C, D, E>(this Result<(A, B, C, D)> x, Func<A, B, C, D, Task<Result<E>>> f)
        {
            return await x.Bind(async y => (await f(y.Item1, y.Item2, y.Item3, y.Item4)).Map(z => new TupleAdder<A, B, C, D>(y).Add(z).Value));
        }

        public static async Task<Result<(A, B, C, D, E)>> TupleMap<A, B, C, D, E>(this Result<(A, B, C, D)> x, Func<A, B, C, D, Task<E>> f)
        {
            return await x.Map(async y => new TupleAdder<A, B, C, D>(y).Add(await f(y.Item1, y.Item2, y.Item3, y.Item4)).Value);
        }

        public static Result<(A, B, C, D, E, F)> TupleBind<A, B, C, D, E, F>(this Result<(A, B, C, D, E)> x, Func<A, B, C, D, E, Result<F>> f)
        {
            return x.Bind(y => f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5).Map(z => new TupleAdder<A, B, C, D, E>(y).Add(z).Value));
        }

        public static Result<(A, B, C, D, E, F)> TupleMap<A, B, C, D, E, F>(this Result<(A, B, C, D, E)> x, Func<A, B, C, D, E, F> f)
        {
            return x.Map(y => new TupleAdder<A, B, C, D, E>(y).Add(f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5)).Value);
        }

        public static async Task<Result<(A, B, C, D, E, F)>> TupleBind<A, B, C, D, E, F>(this Result<(A, B, C, D, E)> x, Func<A, B, C, D, E, Task<Result<F>>> f)
        {
            return await x.Bind(async y => (await f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5)).Map(z => new TupleAdder<A, B, C, D, E>(y).Add(z).Value));
        }

        public static async Task<Result<(A, B, C, D, E, F)>> TupleMap<A, B, C, D, E, F>(this Result<(A, B, C, D, E)> x, Func<A, B, C, D, E, Task<F>> f)
        {
            return await x.Map(async y => new TupleAdder<A, B, C, D, E>(y).Add(await f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5)).Value);
        }

        public static Result<(A, B, C, D, E, F, G)> TupleBind<A, B, C, D, E, F, G>(this Result<(A, B, C, D, E, F)> x, Func<A, B, C, D, E, F, Result<G>> f)
        {
            return x.Bind(y => f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6).Map(z => new TupleAdder<A, B, C, D, E, F>(y).Add(z).Value));
        }

        public static Result<(A, B, C, D, E, F, G)> TupleMap<A, B, C, D, E, F, G>(this Result<(A, B, C, D, E, F)> x, Func<A, B, C, D, E, F, G> f)
        {
            return x.Map(y => new TupleAdder<A, B, C, D, E, F>(y).Add(f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6)).Value);
        }

        public static async Task<Result<(A, B, C, D, E, F, G)>> TupleBind<A, B, C, D, E, F, G>(this Result<(A, B, C, D, E, F)> x, Func<A, B, C, D, E, F, Task<Result<G>>> f)
        {
            return await x.Bind(async y => (await f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6)).Map(z => new TupleAdder<A, B, C, D, E, F>(y).Add(z).Value));
        }

        public static async Task<Result<(A, B, C, D, E, F, G)>> TupleMap<A, B, C, D, E, F, G>(this Result<(A, B, C, D, E, F)> x, Func<A, B, C, D, E, F, Task<G>> f)
        {
            return await x.Map(async y => new TupleAdder<A, B, C, D, E, F>(y).Add(await f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6)).Value);
        }

        public static Result<(A, B, C, D, E, F, G, H)> TupleBind<A, B, C, D, E, F, G, H>(this Result<(A, B, C, D, E, F, G)> x, Func<A, B, C, D, E, F, G, Result<H>> f)
        {
            return x.Bind(y => f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7).Map(z => new TupleAdder<A, B, C, D, E, F, G>(y).Add(z).Value));
        }

        public static Result<(A, B, C, D, E, F, G, H)> TupleMap<A, B, C, D, E, F, G, H>(this Result<(A, B, C, D, E, F, G)> x, Func<A, B, C, D, E, F, G, H> f)
        {
            return x.Map(y => new TupleAdder<A, B, C, D, E, F, G>(y).Add(f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7)).Value);
        }

        public static async Task<Result<(A, B, C, D, E, F, G, H)>> TupleBind<A, B, C, D, E, F, G, H>(this Result<(A, B, C, D, E, F, G)> x, Func<A, B, C, D, E, F, G, Task<Result<H>>> f)
        {
            return await x.Bind(async y => (await f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7)).Map(z => new TupleAdder<A, B, C, D, E, F, G>(y).Add(z).Value));
        }

        public static async Task<Result<(A, B, C, D, E, F, G, H)>> TupleMap<A, B, C, D, E, F, G, H>(this Result<(A, B, C, D, E, F, G)> x, Func<A, B, C, D, E, F, G, Task<H>> f)
        {
            return await x.Map(async y => new TupleAdder<A, B, C, D, E, F, G>(y).Add(await f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7)).Value);
        }

        public static Result<(A, B, C, D, E, F, G, H, I)> TupleBind<A, B, C, D, E, F, G, H, I>(this Result<(A, B, C, D, E, F, G, H)> x, Func<A, B, C, D, E, F, G, H, Result<I>> f)
        {
            return x.Bind(y => f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7, y.Item8).Map(z => new TupleAdder<A, B, C, D, E, F, G, H>(y).Add(z).Value));
        }

        public static Result<(A, B, C, D, E, F, G, H, I)> TupleMap<A, B, C, D, E, F, G, H, I>(this Result<(A, B, C, D, E, F, G, H)> x, Func<A, B, C, D, E, F, G, H, I> f)
        {
            return x.Map(y => new TupleAdder<A, B, C, D, E, F, G, H>(y).Add(f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7, y.Item8)).Value);
        }

        public static async Task<Result<(A, B, C, D, E, F, G, H, I)>> TupleBind<A, B, C, D, E, F, G, H, I>(this Result<(A, B, C, D, E, F, G, H)> x, Func<A, B, C, D, E, F, G, H, Task<Result<I>>> f)
        {
            return await x.Bind(async y => (await f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7, y.Item8)).Map(z => new TupleAdder<A, B, C, D, E, F, G, H>(y).Add(z).Value));
        }

        public static async Task<Result<(A, B, C, D, E, F, G, H, I)>> TupleMap<A, B, C, D, E, F, G, H, I>(this Result<(A, B, C, D, E, F, G, H)> x, Func<A, B, C, D, E, F, G, H, Task<I>> f)
        {
            return await x.Map(async y => new TupleAdder<A, B, C, D, E, F, G, H>(y).Add(await f(y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7, y.Item8)).Value);
        }


        public static Result<(A, B, C)> TupleBind<A, B, C>(this Result<(A, B)> x, Func<(A, B), Result<C>> f)
        {
            return x.Bind(y => f((y.Item1, y.Item2)).Map(z => new TupleAdder<A, B>(y).Add(z).Value));
        }

        public static Result<(A, B, C)> TupleMap<A, B, C>(this Result<(A, B)> x, Func<(A, B), C> f)
        {
            return x.Map(y => new TupleAdder<A, B>(y).Add(f((y.Item1, y.Item2))).Value);
        }

        public static async Task<Result<(A, B, C)>> TupleBind<A, B, C>(this Result<(A, B)> x, Func<(A, B), Task<Result<C>>> f)
        {
            return await x.Bind(async y => (await f((y.Item1, y.Item2))).Map(z => new TupleAdder<A, B>(y).Add(z).Value));
        }

        public static async Task<Result<(A, B, C)>> TupleMap<A, B, C>(this Result<(A, B)> x, Func<(A, B), Task<C>> f)
        {
            return await x.Map(async y => new TupleAdder<A, B>(y).Add(await f((y.Item1, y.Item2))).Value);
        }

        public static Result<TRes> Bind<A, B, TRes>(this Result<(A, B)> result, Func<A, B, Result<TRes>> Func)
        {
            if (result.IsFailure)
                return Result.Failed<TRes>(result.Failure);

            var val = Func(result.Success.Item1, result.Success.Item2);
            return result.Bind(_ => val);
        }

        public static Result Bind<A, B>(this Result<(A, B)> result, Func<A, B, Result> Func)
        {
            if (result.IsFailure)
                return result;

            var val = Func(result.Success.Item1, result.Success.Item2);
            return result.Bind(_ => val);
        }

        public static Result<(A, B)> Tee<A, B>(this Result<(A, B)> x, Action<A, B> f)
        {
            if (x.IsSuccess)
                f(x.Success.Item1, x.Success.Item2);
            return x;
        }

        public static Result<TSuccess> Map<A, B, TSuccess>(this Result<(A, B)> x, Func<A, B, TSuccess> transform)
        {
            if (x.IsFailure)
                return Result.Failed<TSuccess>(x.Failure);
            try
            {
                return Result.Succeeded(transform(x.Success.Item1, x.Success.Item2));
            }
            catch (Exception ex)
            {
                return Result.Failed<TSuccess>(ex.Message);
            }
        }

        public static async Task<Result<TRes>> Bind<A, B, TRes>(this Result<(A, B)> result, Func<A, B, Task<Result<TRes>>> Func)
        {
            if (result.IsFailure)
                return Result.Failed<TRes>(result.Failure);

            var val = await Func(result.Success.Item1, result.Success.Item2);
            return result.Bind(_ => val);
        }

        public static async Task<Result> Bind<A, B>(this Result<(A, B)> Result, Func<A, B, Task<Result>> Func)
        {
            if (Result.IsFailure)
                return Result;

            var val = await Func(Result.Success.Item1, Result.Success.Item2);
            return Result.Bind(_ => val);
        }

        public static async Task<Result<(A, B)>> TeeAsync<A, B>(this Result<(A, B)> x, Func<A, B, Task> f)
        {
            if (x.IsSuccess)
                await f(x.Success.Item1, x.Success.Item2);
            return x;
        }

        public static async Task<Result<TSuccess>> Map<A, B, TSuccess>(this Result<(A, B)> x, Func<A, B, Task<TSuccess>> transform)
        {
            if (x.IsFailure)
                return Result.Failed<TSuccess>(x.Failure);
            try
            {
                return Result.Succeeded(await transform(x.Success.Item1, x.Success.Item2));
            }
            catch (Exception ex)
            {
                return Result.Failed<TSuccess>(ex.Message);
            }
        }

        public static Result<(A, B, C, D)> TupleBind<A, B, C, D>(this Result<(A, B, C)> x, Func<(A, B, C), Result<D>> f)
        {
            return x.Bind(y => f((y.Item1, y.Item2, y.Item3)).Map(z => new TupleAdder<A, B, C>(y).Add(z).Value));
        }

        public static Result<(A, B, C, D)> TupleMap<A, B, C, D>(this Result<(A, B, C)> x, Func<(A, B, C), D> f)
        {
            return x.Map(y => new TupleAdder<A, B, C>(y).Add(f((y.Item1, y.Item2, y.Item3))).Value);
        }

        public static async Task<Result<(A, B, C, D)>> TupleBind<A, B, C, D>(this Result<(A, B, C)> x, Func<(A, B, C), Task<Result<D>>> f)
        {
            return await x.Bind(async y => (await f((y.Item1, y.Item2, y.Item3))).Map(z => new TupleAdder<A, B, C>(y).Add(z).Value));
        }

        public static async Task<Result<(A, B, C, D)>> TupleMap<A, B, C, D>(this Result<(A, B, C)> x, Func<(A, B, C), Task<D>> f)
        {
            return await x.Map(async y => new TupleAdder<A, B, C>(y).Add(await f((y.Item1, y.Item2, y.Item3))).Value);
        }

        public static Result<TRes> Bind<A, B, C, TRes>(this Result<(A, B, C)> result, Func<A, B, C, Result<TRes>> Func)
        {
            if (result.IsFailure)
                return Result.Failed<TRes>(result.Failure);

            var val = Func(result.Success.Item1, result.Success.Item2, result.Success.Item3);
            return result.Bind(_ => val);
        }

        public static Result Bind<A, B, C>(this Result<(A, B, C)> Result, Func<A, B, C, Result> Func)
        {
            if (Result.IsFailure)
                return Result;

            var val = Func(Result.Success.Item1, Result.Success.Item2, Result.Success.Item3);
            return Result.Bind(_ => val);
        }

        public static Result<(A, B, C)> Tee<A, B, C>(this Result<(A, B, C)> x, Action<A, B, C> f)
        {
            if (x.IsSuccess)
                f(x.Success.Item1, x.Success.Item2, x.Success.Item3);
            return x;
        }

        public static Result<TSuccess> Map<A, B, C, TSuccess>(this Result<(A, B, C)> x, Func<A, B, C, TSuccess> transform)
        {
            if (x.IsFailure)
                return Result.Failed<TSuccess>(x.Failure);
            try
            {
                return Result.Succeeded(transform(x.Success.Item1, x.Success.Item2, x.Success.Item3));
            }
            catch (Exception ex)
            {
                return Result.Failed<TSuccess>(ex.Message);
            }
        }

        public static async Task<Result<TRes>> Bind<A, B, C, TRes>(this Result<(A, B, C)> result, Func<A, B, C, Task<Result<TRes>>> Func)
        {
            if (result.IsFailure)
                return Result.Failed<TRes>(result.Failure);

            var val = await Func(result.Success.Item1, result.Success.Item2, result.Success.Item3);
            return result.Bind(_ => val);
        }

        public static async Task<Result> Bind<A, B, C>(this Result<(A, B, C)> Result, Func<A, B, C, Task<Result>> Func)
        {
            if (Result.IsFailure)
                return Result;

            var val = await Func(Result.Success.Item1, Result.Success.Item2, Result.Success.Item3);
            return Result.Bind(_ => val);
        }

        public static async Task<Result<(A, B, C)>> TeeAsync<A, B, C>(this Result<(A, B, C)> x, Func<A, B, C, Task> f)
        {
            if (x.IsSuccess)
                await f(x.Success.Item1, x.Success.Item2, x.Success.Item3);
            return x;
        }

        public static async Task<Result<TSuccess>> Map<A, B, C, TSuccess>(this Result<(A, B, C)> x, Func<A, B, C, Task<TSuccess>> transform)
        {
            if (x.IsFailure)
                return Result.Failed<TSuccess>(x.Failure);
            try
            {
                return Result.Succeeded(await transform(x.Success.Item1, x.Success.Item2, x.Success.Item3));
            }
            catch (Exception ex)
            {
                return Result.Failed<TSuccess>(ex.Message);
            }
        }

        public static Result<(A, B, C, D, E)> TupleBind<A, B, C, D, E>(this Result<(A, B, C, D)> x, Func<(A, B, C, D), Result<E>> f)
        {
            return x.Bind(y => f((y.Item1, y.Item2, y.Item3, y.Item4)).Map(z => new TupleAdder<A, B, C, D>(y).Add(z).Value));
        }

        public static Result<(A, B, C, D, E)> TupleMap<A, B, C, D, E>(this Result<(A, B, C, D)> x, Func<(A, B, C, D), E> f)
        {
            return x.Map(y => new TupleAdder<A, B, C, D>(y).Add(f((y.Item1, y.Item2, y.Item3, y.Item4))).Value);
        }

        public static async Task<Result<(A, B, C, D, E)>> TupleBind<A, B, C, D, E>(this Result<(A, B, C, D)> x, Func<(A, B, C, D), Task<Result<E>>> f)
        {
            return await x.Bind(async y => (await f((y.Item1, y.Item2, y.Item3, y.Item4))).Map(z => new TupleAdder<A, B, C, D>(y).Add(z).Value));
        }

        public static async Task<Result<(A, B, C, D, E)>> TupleMap<A, B, C, D, E>(this Result<(A, B, C, D)> x, Func<(A, B, C, D), Task<E>> f)
        {
            return await x.Map(async y => new TupleAdder<A, B, C, D>(y).Add(await f((y.Item1, y.Item2, y.Item3, y.Item4))).Value);
        }

        public static Result<TRes> Bind<A, B, C, D, TRes>(this Result<(A, B, C, D)> result, Func<A, B, C, D, Result<TRes>> Func)
        {
            if (result.IsFailure)
                return Result.Failed<TRes>(result.Failure);

            var val = Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4);
            return result.Bind(_ => val);
        }

        public static Result Bind<A, B, C, D>(this Result<(A, B, C, D)> Result, Func<A, B, C, D, Result> Func)
        {
            if (Result.IsFailure)
                return Result;

            var val = Func(Result.Success.Item1, Result.Success.Item2, Result.Success.Item3, Result.Success.Item4);
            return Result.Bind(_ => val);
        }

        public static Result<(A, B, C, D)> Tee<A, B, C, D>(this Result<(A, B, C, D)> x, Action<A, B, C, D> f)
        {
            if (x.IsSuccess)
                f(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4);
            return x;
        }

        public static Result<TSuccess> Map<A, B, C, D, TSuccess>(this Result<(A, B, C, D)> x, Func<A, B, C, D, TSuccess> transform)
        {
            if (x.IsFailure)
                return Result.Failed<TSuccess>(x.Failure);
            try
            {
                return Result.Succeeded(transform(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4));
            }
            catch (Exception ex)
            {
                return Result.Failed<TSuccess>(ex.Message);
            }
        }

        public static async Task<Result<TRes>> Bind<A, B, C, D, TRes>(this Result<(A, B, C, D)> result, Func<A, B, C, D, Task<Result<TRes>>> Func)
        {
            if (result.IsFailure)
                return Result.Failed<TRes>(result.Failure);

            var val = await Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4);
            return result.Bind(_ => val);
        }

        public static async Task<Result> Bind<A, B, C, D>(this Result<(A, B, C, D)> result, Func<A, B, C, D, Task<Result>> Func)
        {
            if (result.IsFailure)
                return result;

            var val = await Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4);
            return result.Bind(_ => val);
        }

        public static async Task<Result<(A, B, C, D)>> TeeAsync<A, B, C, D>(this Result<(A, B, C, D)> x, Func<A, B, C, D, Task> f)
        {
            if (x.IsSuccess)
                await f(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4);
            return x;
        }

        public static async Task<Result<TSuccess>> Map<A, B, C, D, TSuccess>(this Result<(A, B, C, D)> x, Func<A, B, C, D, Task<TSuccess>> transform)
        {
            if (x.IsFailure)
                return Result.Failed<TSuccess>(x.Failure);
            try
            {
                return Result.Succeeded(await transform(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4));
            }
            catch (Exception ex)
            {
                return Result.Failed<TSuccess>(ex.Message);
            }
        }

        public static Result<(A, B, C, D, E, F)> TupleBind<A, B, C, D, E, F>(this Result<(A, B, C, D, E)> x, Func<(A, B, C, D, E), Result<F>> f)
        {
            return x.Bind(y => f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5)).Map(z => new TupleAdder<A, B, C, D, E>(y).Add(z).Value));
        }

        public static Result<(A, B, C, D, E, F)> TupleMap<A, B, C, D, E, F>(this Result<(A, B, C, D, E)> x, Func<(A, B, C, D, E), F> f)
        {
            return x.Map(y => new TupleAdder<A, B, C, D, E>(y).Add(f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5))).Value);
        }

        public static async Task<Result<(A, B, C, D, E, F)>> TupleBind<A, B, C, D, E, F>(this Result<(A, B, C, D, E)> x, Func<(A, B, C, D, E), Task<Result<F>>> f)
        {
            return await x.Bind(async y => (await f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5))).Map(z => new TupleAdder<A, B, C, D, E>(y).Add(z).Value));
        }

        public static async Task<Result<(A, B, C, D, E, F)>> TupleMap<A, B, C, D, E, F>(this Result<(A, B, C, D, E)> x, Func<(A, B, C, D, E), Task<F>> f)
        {
            return await x.Map(async y => new TupleAdder<A, B, C, D, E>(y).Add(await f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5))).Value);
        }

        public static Result<TRes> Bind<A, B, C, D, E, TRes>(this Result<(A, B, C, D, E)> result, Func<A, B, C, D, E, Result<TRes>> Func)
        {
            if (result.IsFailure)
                return Result.Failed<TRes>(result.Failure);

            var val = Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5);
            return result.Bind(_ => val);
        }

        public static Result Bind<A, B, C, D, E>(this Result<(A, B, C, D, E)> result, Func<A, B, C, D, E, Result> Func)
        {
            if (result.IsFailure)
                return result;

            var val = Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5);
            return result.Bind(_ => val);
        }

        public static Result<(A, B, C, D, E)> Tee<A, B, C, D, E>(this Result<(A, B, C, D, E)> x, Action<A, B, C, D, E> f)
        {
            if (x.IsSuccess)
                f(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5);
            return x;
        }

        public static Result<TSuccess> Map<A, B, C, D, E, TSuccess>(this Result<(A, B, C, D, E)> x, Func<A, B, C, D, E, TSuccess> transform)
        {
            if (x.IsFailure)
                return Result.Failed<TSuccess>(x.Failure);
            try
            {
                return Result.Succeeded(transform(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5));
            }
            catch (Exception ex)
            {
                return Result.Failed<TSuccess>(ex.Message);
            }
        }

        public static async Task<Result<TRes>> Bind<A, B, C, D, E, TRes>(this Result<(A, B, C, D, E)> result, Func<A, B, C, D, E, Task<Result<TRes>>> Func)
        {
            if (result.IsFailure)
                return Result.Failed<TRes>(result.Failure);

            var val = await Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5);
            return result.Bind(_ => val);
        }

        public static async Task<Result> Bind<A, B, C, D, E>(this Result<(A, B, C, D, E)> result, Func<A, B, C, D, E, Task<Result>> Func)
        {
            if (result.IsFailure)
                return result;

            var val = await Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5);
            return result.Bind(_ => val);
        }

        public static async Task<Result<(A, B, C, D, E)>> TeeAsync<A, B, C, D, E>(this Result<(A, B, C, D, E)> x, Func<A, B, C, D, E, Task> f)
        {
            if (x.IsSuccess)
                await f(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5);
            return x;
        }

        public static async Task<Result<TSuccess>> Map<A, B, C, D, E, TSuccess>(this Result<(A, B, C, D, E)> x, Func<A, B, C, D, E, Task<TSuccess>> transform)
        {
            if (x.IsFailure)
                return Result.Failed<TSuccess>(x.Failure);
            try
            {
                return Result.Succeeded(await transform(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5));
            }
            catch (Exception ex)
            {
                return Result.Failed<TSuccess>(ex.Message);
            }
        }

        public static Result<(A, B, C, D, E, F, G)> TupleBind<A, B, C, D, E, F, G>(this Result<(A, B, C, D, E, F)> x, Func<(A, B, C, D, E, F), Result<G>> f)
        {
            return x.Bind(y => f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6)).Map(z => new TupleAdder<A, B, C, D, E, F>(y).Add(z).Value));
        }

        public static Result<(A, B, C, D, E, F, G)> TupleMap<A, B, C, D, E, F, G>(this Result<(A, B, C, D, E, F)> x, Func<(A, B, C, D, E, F), G> f)
        {
            return x.Map(y => new TupleAdder<A, B, C, D, E, F>(y).Add(f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6))).Value);
        }

        public static async Task<Result<(A, B, C, D, E, F, G)>> TupleBind<A, B, C, D, E, F, G>(this Result<(A, B, C, D, E, F)> x, Func<(A, B, C, D, E, F), Task<Result<G>>> f)
        {
            return await x.Bind(async y => (await f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6))).Map(z => new TupleAdder<A, B, C, D, E, F>(y).Add(z).Value));
        }

        public static async Task<Result<(A, B, C, D, E, F, G)>> TupleMap<A, B, C, D, E, F, G>(this Result<(A, B, C, D, E, F)> x, Func<(A, B, C, D, E, F), Task<G>> f)
        {
            return await x.Map(async y => new TupleAdder<A, B, C, D, E, F>(y).Add(await f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6))).Value);
        }

        public static Result<TRes> Bind<A, B, C, D, E, F, TRes>(this Result<(A, B, C, D, E, F)> result, Func<A, B, C, D, E, F, Result<TRes>> Func)
        {
            if (result.IsFailure)
                return Result.Failed<TRes>(result.Failure);

            var val = Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5, result.Success.Item6);
            return result.Bind(_ => val);
        }

        public static Result Bind<A, B, C, D, E, F>(this Result<(A, B, C, D, E, F)> result, Func<A, B, C, D, E, F, Result> Func)
        {
            if (result.IsFailure)
                return result;

            var val = Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5, result.Success.Item6);
            return result.Bind(_ => val);
        }

        public static Result<(A, B, C, D, E, F)> Tee<A, B, C, D, E, F>(this Result<(A, B, C, D, E, F)> x, Action<A, B, C, D, E, F> f)
        {
            if (x.IsSuccess)
                f(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5, x.Success.Item6);
            return x;
        }

        public static Result<TSuccess> Map<A, B, C, D, E, F, TSuccess>(this Result<(A, B, C, D, E, F)> x, Func<A, B, C, D, E, F, TSuccess> transform)
        {
            if (x.IsFailure)
                return Result.Failed<TSuccess>(x.Failure);
            return Result.Succeeded(transform(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5, x.Success.Item6));
        }

        public static async Task<Result<TRes>> Bind<A, B, C, D, E, F, TRes>(this Result<(A, B, C, D, E, F)> result, Func<A, B, C, D, E, F, Task<Result<TRes>>> Func)
        {
            if (result.IsFailure)
                return Result.Failed<TRes>(result.Failure);

            var val = await Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5, result.Success.Item6);
            return result.Bind(_ => val);
        }

        public static async Task<Result> Bind<A, B, C, D, E, F>(this Result<(A, B, C, D, E, F)> result, Func<A, B, C, D, E, F, Task<Result>> Func)
        {
            if (result.IsFailure)
                return result;

            var val = await Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5, result.Success.Item6);
            return result.Bind(_ => val);
        }

        public static async Task<Result<(A, B, C, D, E, F)>> TeeAsync<A, B, C, D, E, F>(this Result<(A, B, C, D, E, F)> x, Func<A, B, C, D, E, F, Task> f)
        {
            if (x.IsSuccess)
                await f(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5, x.Success.Item6);
            return x;
        }

        public static async Task<Result<TSuccess>> Map<A, B, C, D, E, F, TSuccess>(this Result<(A, B, C, D, E, F)> x, Func<A, B, C, D, E, F, Task<TSuccess>> transform)
        {
            if (x.IsFailure)
                return Result.Failed<TSuccess>(x.Failure);
            try
            {
                return Result.Succeeded(await transform(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5, x.Success.Item6));
            }
            catch (Exception ex)
            {
                return Result.Failed<TSuccess>(ex.Message);
            }
        }

        public static Result<(A, B, C, D, E, F, G, H)> TupleBind<A, B, C, D, E, F, G, H>(this Result<(A, B, C, D, E, F, G)> x, Func<(A, B, C, D, E, F, G), Result<H>> f)
        {
            return x.Bind(y => f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7)).Map(z => new TupleAdder<A, B, C, D, E, F, G>(y).Add(z).Value));
        }

        public static Result<(A, B, C, D, E, F, G, H)> TupleMap<A, B, C, D, E, F, G, H>(this Result<(A, B, C, D, E, F, G)> x, Func<(A, B, C, D, E, F, G), H> f)
        {
            return x.Map(y => new TupleAdder<A, B, C, D, E, F, G>(y).Add(f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7))).Value);
        }

        public static async Task<Result<(A, B, C, D, E, F, G, H)>> TupleBind<A, B, C, D, E, F, G, H>(this Result<(A, B, C, D, E, F, G)> x, Func<(A, B, C, D, E, F, G), Task<Result<H>>> f)
        {
            return await x.Bind(async y => (await f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7))).Map(z => new TupleAdder<A, B, C, D, E, F, G>(y).Add(z).Value));
        }

        public static async Task<Result<(A, B, C, D, E, F, G, H)>> TupleMap<A, B, C, D, E, F, G, H>(this Result<(A, B, C, D, E, F, G)> x, Func<(A, B, C, D, E, F, G), Task<H>> f)
        {
            return await x.Map(async y => new TupleAdder<A, B, C, D, E, F, G>(y).Add(await f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7))).Value);
        }

        public static Result<TRes> Bind<A, B, C, D, E, F, G, TRes>(this Result<(A, B, C, D, E, F, G)> result, Func<A, B, C, D, E, F, G, Result<TRes>> Func)
        {
            if (result.IsFailure)
                return Result.Failed<TRes>(result.Failure);

            var val = Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5, result.Success.Item6, result.Success.Item7);
            return result.Bind(_ => val);
        }

        public static Result Bind<A, B, C, D, E, F, G>(this Result<(A, B, C, D, E, F, G)> result, Func<A, B, C, D, E, F, G, Result> Func)
        {
            if (result.IsFailure)
                return result;

            var val = Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5, result.Success.Item6, result.Success.Item7);
            return result.Bind(_ => val);
        }

        public static Result<(A, B, C, D, E, F, G)> Tee<A, B, C, D, E, F, G>(this Result<(A, B, C, D, E, F, G)> x, Action<A, B, C, D, E, F, G> f)
        {
            if (x.IsSuccess)
                f(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5, x.Success.Item6, x.Success.Item7);
            return x;
        }

        public static Result<TSuccess> Map<A, B, C, D, E, F, G, TSuccess>(this Result<(A, B, C, D, E, F, G)> x, Func<A, B, C, D, E, F, G, TSuccess> transform)
        {
            if (x.IsFailure)
                return Result.Failed<TSuccess>(x.Failure);
            try
            {
                return Result.Succeeded(transform(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5, x.Success.Item6, x.Success.Item7));
            }
            catch (Exception ex)
            {
                return Result.Failed<TSuccess>(ex.Message);
            }
        }

        public static async Task<Result<TRes>> Bind<A, B, C, D, E, F, G, TRes>(this Result<(A, B, C, D, E, F, G)> result, Func<A, B, C, D, E, F, G, Task<Result<TRes>>> Func)
        {
            if (result.IsFailure)
                return Result.Failed<TRes>(result.Failure);

            var val = await Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5, result.Success.Item6, result.Success.Item7);
            return result.Bind(_ => val);
        }

        public static async Task<Result> Bind<A, B, C, D, E, F, G>(this Result<(A, B, C, D, E, F, G)> result, Func<A, B, C, D, E, F, G, Task<Result>> Func)
        {
            if (result.IsFailure)
                return result;

            var val = await Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5, result.Success.Item6, result.Success.Item7);
            return result.Bind(_ => val);
        }

        public static async Task<Result<(A, B, C, D, E, F, G)>> TeeAsync<A, B, C, D, E, F, G>(this Result<(A, B, C, D, E, F, G)> x, Func<A, B, C, D, E, F, G, Task> f)
        {
            if (x.IsSuccess)
                await f(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5, x.Success.Item6, x.Success.Item7);
            return x;
        }

        public static async Task<Result<TSuccess>> Map<A, B, C, D, E, F, G, TSuccess>(this Result<(A, B, C, D, E, F, G)> x, Func<A, B, C, D, E, F, G, Task<TSuccess>> transform)
        {
            if (x.IsFailure)
                return Result.Failed<TSuccess>(x.Failure);
            try
            {
                return Result.Succeeded(await transform(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5, x.Success.Item6, x.Success.Item7));
            }
            catch (Exception ex)
            {
                return Result.Failed<TSuccess>(ex.Message);
            }
        }

        public static Result<(A, B, C, D, E, F, G, H, I)> TupleBind<A, B, C, D, E, F, G, H, I>(this Result<(A, B, C, D, E, F, G, H)> x, Func<(A, B, C, D, E, F, G, H), Result<I>> f)
        {
            return x.Bind(y => f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7, y.Item8)).Map(z => new TupleAdder<A, B, C, D, E, F, G, H>(y).Add(z).Value));
        }

        public static Result<(A, B, C, D, E, F, G, H, I)> TupleMap<A, B, C, D, E, F, G, H, I>(this Result<(A, B, C, D, E, F, G, H)> x, Func<(A, B, C, D, E, F, G, H), I> f)
        {
            return x.Map(y => new TupleAdder<A, B, C, D, E, F, G, H>(y).Add(f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7, y.Item8))).Value);
        }

        public static async Task<Result<(A, B, C, D, E, F, G, H, I)>> TupleBind<A, B, C, D, E, F, G, H, I>(this Result<(A, B, C, D, E, F, G, H)> x, Func<(A, B, C, D, E, F, G, H), Task<Result<I>>> f)
        {
            return await x.Bind(async y => (await f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7, y.Item8))).Map(z => new TupleAdder<A, B, C, D, E, F, G, H>(y).Add(z).Value));
        }

        public static async Task<Result<(A, B, C, D, E, F, G, H, I)>> TupleMap<A, B, C, D, E, F, G, H, I>(this Result<(A, B, C, D, E, F, G, H)> x, Func<(A, B, C, D, E, F, G, H), Task<I>> f)
        {
            return await x.Map(async y => new TupleAdder<A, B, C, D, E, F, G, H>(y).Add(await f((y.Item1, y.Item2, y.Item3, y.Item4, y.Item5, y.Item6, y.Item7, y.Item8))).Value);
        }

        public static Result<TRes> Bind<A, B, C, D, E, F, G, H, TRes>(this Result<(A, B, C, D, E, F, G, H)> result, Func<A, B, C, D, E, F, G, H, Result<TRes>> Func)
        {
            if (result.IsFailure)
                return Result.Failed<TRes>(result.Failure);

            var val = Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5, result.Success.Item6, result.Success.Item7, result.Success.Item8);
            return result.Bind(_ => val);
        }

        public static Result Bind<A, B, C, D, E, F, G, H>(this Result<(A, B, C, D, E, F, G, H)> result, Func<A, B, C, D, E, F, G, H, Result> Func)
        {
            if (result.IsFailure)
                return result;

            var val = Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5, result.Success.Item6, result.Success.Item7, result.Success.Item8);
            return result.Bind(_ => val);
        }

        public static Result<(A, B, C, D, E, F, G, H)> Tee<A, B, C, D, E, F, G, H>(this Result<(A, B, C, D, E, F, G, H)> x, Action<A, B, C, D, E, F, G, H> f)
        {
            if (x.IsSuccess)
                f(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5, x.Success.Item6, x.Success.Item7, x.Success.Item8);
            return x;
        }

        public static Result<TSuccess> Map<A, B, C, D, E, F, G, H, TSuccess>(this Result<(A, B, C, D, E, F, G, H)> x, Func<A, B, C, D, E, F, G, H, TSuccess> transform)
        {
            if (x.IsFailure)
                return Result.Failed<TSuccess>(x.Failure);
            try
            {
                return Result.Succeeded(transform(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5, x.Success.Item6, x.Success.Item7, x.Success.Item8));
            }
            catch (Exception ex)
            {
                return Result.Failed<TSuccess>(ex.Message);
            }
        }

        public static async Task<Result<TRes>> Bind<A, B, C, D, E, F, G, H, TRes>(this Result<(A, B, C, D, E, F, G, H)> result, Func<A, B, C, D, E, F, G, H, Task<Result<TRes>>> Func)
        {
            if (result.IsFailure)
                return Result.Failed<TRes>(result.Failure);

            var val = await Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5, result.Success.Item6, result.Success.Item7, result.Success.Item8);
            return result.Bind(_ => val);
        }

        public static async Task<Result> Bind<A, B, C, D, E, F, G, H>(this Result<(A, B, C, D, E, F, G, H)> result, Func<A, B, C, D, E, F, G, H, Task<Result>> Func)
        {
            if (result.IsFailure)
                return result;

            var val = await Func(result.Success.Item1, result.Success.Item2, result.Success.Item3, result.Success.Item4, result.Success.Item5, result.Success.Item6, result.Success.Item7, result.Success.Item8);
            return result.Bind(_ => val);
        }

        public static async Task<Result<(A, B, C, D, E, F, G, H)>> TeeAsync<A, B, C, D, E, F, G, H>(this Result<(A, B, C, D, E, F, G, H)> x, Func<A, B, C, D, E, F, G, H, Task> f)
        {
            if (x.IsSuccess)
                await f(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5, x.Success.Item6, x.Success.Item7, x.Success.Item8);
            return x;
        }

        public static async Task<Result<TSuccess>> Map<A, B, C, D, E, F, G, H, TSuccess>(this Result<(A, B, C, D, E, F, G, H)> x, Func<A, B, C, D, E, F, G, H, Task<TSuccess>> transform)
        {
            if (x.IsFailure)
                return Result.Failed<TSuccess>(x.Failure);
            try
            {
                return Result.Succeeded(await transform(x.Success.Item1, x.Success.Item2, x.Success.Item3, x.Success.Item4, x.Success.Item5, x.Success.Item6, x.Success.Item7, x.Success.Item8));
            }
            catch (Exception ex)
            {
                return Result.Failed<TSuccess>(ex.Message);
            }
        }

    }
}
