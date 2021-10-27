using System;
using System.Threading.Tasks;
using System.Data;
using ServiceStack.OrmLite;
using System.Collections.Generic;
using System.Threading;
using System.Linq.Expressions;
using System.Linq;

namespace Infrastructure
{
    public static class DatabaseExtensions
    {
        public static async Task<Result<T>> SingleById<T>(this IDatabaseInterface db,
            string idValue, CancellationToken token = default)
        {
            return await db.SingleById<T>(Guid.Parse(idValue), token);
        }

        public static async Task<Result<T>> InsertResult<T>(this IDatabaseInterface db, 
            T model, CancellationToken token = default) where T : class
        {
            return (await db.Insert(model, token))
                .Map(_ => model);
        }

        public static async Task<Result<T>> DeleteResult<T>(this IDatabaseInterface db,
            T model, CancellationToken token = default) where T : class
        {
            return (await db.Delete(model, token: token))
                .Map(_ => model);
        }

        public static async Task<Result<T>> UpdateResult<T>(this IDatabaseInterface db,
            T model, CancellationToken token = default)
        {
            return (await db.Update(model, token))
                .Map(_ => model);
        }

        public static async Task<Result<List<T>>> LoadSelect<T>(this IDatabaseInterface db,
            CancellationToken token = default)
        {
            return await (await db.Select<T>(token))
                .TeeResult(results =>
                    results.Select(x => db.LoadReferences(x, token)).Aggregate());
        }

        public static async Task<Result<List<T>>> LoadSelect<T>(this IDatabaseInterface db,
            Expression<Func<T, bool>> expression, CancellationToken token = default)
        {
            return await (await db.Select<T>(expression, token))
                .TeeResult(results =>
                    results.Select(x => db.LoadReferences(x, token)).Aggregate());
        }

        public static async Task<Result<List<T>>> LoadSelect<T>(this IDatabaseInterface db,
            SqlExpression<T> expression, CancellationToken token = default)
        {
            return await (await db.Select<T>(expression, token))
                .TeeResult(results =>
                    results.Select(x => db.LoadReferences(x, token)).Aggregate());
        }
        
    }
}