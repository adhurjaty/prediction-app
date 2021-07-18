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
        Task LoadReferences<T>(T model, CancellationToken token = default);
        Task<List<T>> Select<T>(CancellationToken token = default);
        Task<List<T>> Select<T>(Expression<Func<T, bool>> expression, CancellationToken token = default);
        Task<List<T>> Select<T>(SqlExpression<T> expression, CancellationToken token = default);
        Task<T> SingleById<T>(object idValue, CancellationToken token = default);
        Task<T> Single<T>(Expression<Func<T, bool>> expression, CancellationToken token = default);
        Task<T> LoadSingleById<T>(object idValue, CancellationToken token = default);
        Task<long> Insert<T>(T model, CancellationToken token = default);
        Task<int> Update<T>(T model, CancellationToken token = default);
        Task<int> Delete<T>(T model, CancellationToken token = default);
        void DeleteAll<T>();
        SqlExpression<T> From<T>();
    }

    public class DatabaseInterface : IDatabaseInterface
    {
        private readonly IDbConnectionFactory _dbFactory;

        public DatabaseInterface(IDbConnectionFactory dbFactory)
        {
            _dbFactory = dbFactory;
        }

        public async Task<int> Delete<T>(T model, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            return await db.DeleteAsync(model, token: token);
        }

        public async Task<long> Insert<T>(T model, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            return await db.InsertAsync(model, token: token);
        }

        public async Task LoadReferences<T>(T model, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            await db.LoadReferencesAsync(model, token: token);
        }

        public async Task<T> LoadSingleById<T>(object idValue, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            return await db.LoadSingleByIdAsync<T>(idValue, token: token);
        }

        public async Task<List<T>> Select<T>(CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            return await db.SelectAsync<T>(token: token);
        }

        public async Task<List<T>> Select<T>(Expression<Func<T, bool>> expression, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            return await db.SelectAsync(expression, token: token);
        }

        public async Task<T> SingleById<T>(object idValue, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            return await db.SingleByIdAsync<T>(idValue, token: token);
        }

        public async Task<T> Single<T>(Expression<Func<T, bool>> expression, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            return await db.SingleAsync<T>(expression, token: token);
        }

        public async Task<List<T>> Select<T>(SqlExpression<T> expression, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            return await db.SelectAsync(expression, token: token);
        }

        public async Task<int> Update<T>(T model, CancellationToken token = default)
        {
            using var db = _dbFactory.OpenDbConnection();
            return await db.UpdateAsync(model, token: token);
        }

        public SqlExpression<T> From<T>()
        {
            using var db = _dbFactory.OpenDbConnection();
            return db.From<T>();
        }

        public void DeleteAll<T>()
        {
            using var db = _dbFactory.OpenDbConnection();
            db.DeleteAll<T>();
        }
    }
}