using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.Data;
using ServiceStack.OrmLite;

namespace WebApi
{
    public class ModelsDatbaseInterface : IDatabaseInterface
    {
        private readonly IDatabaseInterface _db;
        private readonly IDbStrategyFactory _strategyFactory;

        public ModelsDatbaseInterface(IDatabaseInterface db, 
            IDbStrategyFactory strategyFactory)
        {
            _db = db;
            _strategyFactory = strategyFactory;
        }

        public async Task<Result> LoadReferences<T>(T model, CancellationToken token = default)
        {
            var strategy = _strategyFactory.Get<T>();
            return await strategy.LoadReferences(_db, model, token);
        }

        public async Task<Result<long>> Insert<T>(T model, CancellationToken token = default)
        {
            var strategy = _strategyFactory.Get<T>();
            return await strategy.Insert(_db, model, token);
        }

        public async Task<Result<int>> Update<T>(T model, CancellationToken token = default)
        {
            var strategy = _strategyFactory.Get<T>();
            return await strategy.Update(_db, model, token);
        }

        public async Task<Result<int>> Delete<T>(T model, CancellationToken token = default)
        {
            var strategy = _strategyFactory.Get<T>();
            return await strategy.Delete(_db, model, token);
        }

        public Task<Result<List<T>>> Select<T>(CancellationToken token = default)
        {
            return _db.Select<T>(token);
        }

        public Task<Result<List<T>>> Select<T>(Expression<Func<T, bool>> expression, CancellationToken token = default)
        {
            return _db.Select(expression, token);
        }

        public Task<Result<List<T>>> Select<T>(SqlExpression<T> expression, CancellationToken token = default)
        {
            return _db.Select(expression, token);
        }

        public Task<Result<T>> SingleById<T>(object idValue, CancellationToken token = default)
        {
            return _db.SingleById<T>(idValue, token);
        }

        public Task<Result<T>> Single<T>(Expression<Func<T, bool>> expression, CancellationToken token = default)
        {
            return _db.Single(expression, token);
        }

        public Task<Result<T>> LoadSingleById<T>(object idValue, CancellationToken token = default)
        {
            return _db.LoadSingleById<T>(idValue, token);
        }

        public Result DeleteAll<T>()
        {
            return _db.DeleteAll<T>();
        }

        public SqlExpression<T> From<T>()
        {
            return _db.From<T>();
        }
    }
}