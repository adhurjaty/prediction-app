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

        public static async Task<Result<T>> LoadSingleById<T>(this IDatabaseInterface db,
            Guid idValue, CancellationToken token = default)
        {
            return await (await db.LoadSingleById<T>(idValue, token: token))
                .TeeResult(result => db.LoadReferences(result, token));
        }

        public static async Task<Result<T>> LoadSingleById<T>(this IDatabaseInterface db,
            string idValue, CancellationToken token = default)
        {
            return await db.LoadSingleById<T>(Guid.Parse(idValue), token);
        }
        
        public static async Task<Result<T>> Insert<T>(this IDatabaseInterface db, 
            T model, CancellationToken token = default) where T : class
        {
            return (await db.Insert(model, token))
                .Map(_ => model);
        }

        public static async Task<Result<T>> Delete<T>(this IDatabaseInterface db,
            T model, CancellationToken token = default) where T : class
        {
            return (await db.Delete(model, token: token))
                .Map(_ => model);
        }

        public static async Task<Result<T>> Update<T>(this IDatabaseInterface db,
            T model, CancellationToken token = default)
        {
            return (await db.Update(db))
                .Map(_ => model);
        }
    }
}