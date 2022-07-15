using System;
using System.Collections.Generic;
using System.Data;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using ServiceStack.Data;
using ServiceStack.OrmLite;

namespace Infrastructure
{
    public interface IDatabaseInterface
    {
        Task<Result> LoadReferences<T>(T model, CancellationToken token = default);
        Task<Result<List<T>>> Select<T>(CancellationToken token = default);
        Task<Result<List<T>>> Select<T>(Expression<Func<T, bool>> expression, CancellationToken token = default);
        Task<Result<List<T>>> Select<T>(SqlExpression<T> expression, CancellationToken token = default);
        Task<Result<T>> SingleById<T>(Guid idValue, CancellationToken token = default);
        Task<Result<T>> SingleById<T>(string idValue, CancellationToken token = default);
        Task<Result<T>> Single<T>(Expression<Func<T, bool>> expression, CancellationToken token = default);
        Task<Result<T>> LoadSingleById<T>(Guid idValue, CancellationToken token = default);
        Task<Result<T>> LoadSingleById<T>(string idValue, CancellationToken token = default);
        Task<Result<long>> Insert<T>(T model, CancellationToken token = default);
        Task<Result<int>> Update<T>(T model, CancellationToken token = default);
        Task<Result<int>> Delete<T>(T model, CancellationToken token = default);
        Result DeleteAll<T>();
        SqlExpression<T> From<T>();
    }

    public class DatabaseInterface : IDatabaseInterface
    {
        private readonly IDbConnectionFactory _dbFactory;

        public DatabaseInterface(IDbConnectionFactory dbFactory)
        {
            _dbFactory = dbFactory;
        }

        public async Task<Result<int>> Delete<T>(T model, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            var numDeleted = await db.DeleteAsync(model, token: token);
            return numDeleted == 1
                ? Result.Succeeded(numDeleted)
                : Result<int>.Failed($"Failed to delete from table {model.GetType().Name}");
        }

        public async Task<Result<long>> Insert<T>(T model, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            var id = await db.InsertAsync(model, token: token);
            return id > 0
                ? Result.Succeeded(id)
                : Result.Failed<long>("Failure inserting model");
        }

        public async Task<Result> LoadReferences<T>(T model, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            await db.LoadReferencesAsync(model, token: token);
            return Result.Succeeded();  // not sure what a failure would look like
        }

        public async Task<Result<T>> LoadSingleById<T>(Guid idValue, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            var model = await db.LoadSingleByIdAsync<T>(idValue, token: token);
            return model is not null
                ? Result.Succeeded(model)
                : Result<T>.Failed("No matching result");
        }

        public async Task<Result<T>> LoadSingleById<T>(string idValue, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            var model = await db.LoadSingleByIdAsync<T>(Guid.Parse(idValue), token: token);
            return model is not null
                ? Result.Succeeded(model)
                : Result<T>.Failed("No matching result");
        }

        public async Task<Result<List<T>>> Select<T>(CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            return Result.Succeeded(await db.SelectAsync<T>(token: token));
        }

        public async Task<Result<List<T>>> Select<T>(Expression<Func<T, bool>> expression, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            return Result.Succeeded(await db.SelectAsync(expression, token: token));
        }

        public async Task<Result<T>> SingleById<T>(Guid idValue, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            var model = await db.SingleByIdAsync<T>(idValue, token: token);
            return model is not null
                ? Result.Succeeded(model)
                : Result.Failed<T>("No matching result");
        }

        public async Task<Result<T>> SingleById<T>(string idValue, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            var model = await db.SingleByIdAsync<T>(Guid.Parse(idValue), token: token);
            return model is not null
                ? Result.Succeeded(model)
                : Result.Failed<T>("No matching result");
        }

        public async Task<Result<T>> Single<T>(Expression<Func<T, bool>> expression, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            var model = await db.SingleAsync<T>(expression, token: token);
            return model is not null
                ? Result.Succeeded(model)
                : Result<T>.Failed("No matching result");
        }

        public async Task<Result<List<T>>> Select<T>(SqlExpression<T> expression, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            return Result.Succeeded(await db.SelectAsync(expression, token: token));
        }

        public async Task<Result<int>> Update<T>(T model, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            var numUpdated = await db.UpdateAsync(model, token: token);
            return numUpdated > 0
                ? Result.Succeeded(numUpdated)
                : Result<int>.Failed($"Could not update record");
        }

        public SqlExpression<T> From<T>()
        {
            using var db = _dbFactory.OpenDbConnection();
            return db.From<T>();
        }

        public Result DeleteAll<T>()
        {
            using var db = _dbFactory.OpenDbConnection();
            db.DeleteAll<T>();
            return Result.Succeeded();
        }
    }
}