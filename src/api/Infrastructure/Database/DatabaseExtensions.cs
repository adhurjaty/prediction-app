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
        public static async Task<Result<T>> SingleResult<T>(this IDatabaseInterface db,
            Expression<Func<T, bool>> expr, CancellationToken token = default)
        {
            var result = await db.Single(expr, token);
            return result != null 
                ? Result<T>.Succeeded(result)
                : Result<T>.Failed("No matching result");
        }

        public static async Task<Result<T>> SingleResultById<T>(this IDatabaseInterface db,
            Guid idValue, CancellationToken token = default)
        {
            var result = await db.SingleById<T>(idValue, token);
            return result != null 
                ? Result<T>.Succeeded(result)
                : Result<T>.Failed("No matching result");
        }

        public static async Task<Result<T>> SingleResultById<T>(this IDatabaseInterface db,
            string idValue, CancellationToken token = default)
        {
            return await db.SingleResultById<T>(Guid.Parse(idValue), token);
        }

        public static async Task<Result<T>> LoadSingleResultById<T>(this IDatabaseInterface db,
            Guid idValue, CancellationToken token = default) where T : DbModel
        {
            var result = await db.LoadSingleById<T>(idValue, token: token);
            if(result != null && result is CompositeDbModel cdb)
                await cdb.LoadReferences(db, token);
            return result != null
                ? Result<T>.Succeeded(result)
                : Result<T>.Failed("No matching result");
        }

        public static async Task<Result<T>> LoadSingleResultById<T>(this IDatabaseInterface db,
            string idValue, CancellationToken token = default) where T : DbModel
        {
            return await db.LoadSingleResultById<T>(Guid.Parse(idValue), token);
        }
        
        public static async Task<Result<List<T>>> SelectResult<T>(this IDatabaseInterface db,
            Expression<Func<T, bool>> expr, CancellationToken token = default)
        {
            var result = await db.Select(expr, token);
            if(result != null && result.FirstOrDefault() is CompositeDbModel model)
            {
                await Task.WhenAll(result.Select(m => 
                    (m as CompositeDbModel).LoadReferences(db, token)));
            }
            return Result<List<T>>.Succeeded(result ?? new List<T>());
        }

        public static async Task<Result<List<T>>> SelectResult<T>(this IDatabaseInterface db,
            SqlExpression<T> expr, CancellationToken token = default)
        {
            var result = await db.Select(expr, token);
            if(result != null && result.FirstOrDefault() is CompositeDbModel model)
            {
                await Task.WhenAll(result.Select(m => 
                    (m as CompositeDbModel).LoadReferences(db, token)));
            }
            return Result<List<T>>.Succeeded(result ?? new List<T>());
        }

        public static async Task<Result<List<T>>> SelectResult<T>(this IDatabaseInterface db,
            CancellationToken token = default)
        {
            return await db.SelectResult<T>(x => true, token);
        }

        public static async Task<Result<T>> InsertResult<T>(this IDatabaseInterface db, 
            T model, CancellationToken token = default) where T : class
        {
            if(model is DbModel dbModel)
                return (await dbModel.Insert(db)).Map(m => m as T);
            return await db.Insert(model, token) > 0
                ? Result.Succeeded(model)
                : Result<T>.Failed($"Could not insert ${model.GetType().Name}");
        }

        public static async Task<Result<T>> DeleteResult<T>(this IDatabaseInterface db,
            T model, CancellationToken token = default) where T : class
        {
            if(model is DbModel dbModel)
                return (await dbModel.Delete(db)).Map(m => m as T);
                
            var numDeleted = await db.Delete(model, token: token);
            return numDeleted == 1
                ? Result.Succeeded(model)
                : Result<T>.Failed($"Failed to delete from table {model.GetType().Name}");
        }

        public static async Task<Result<T>> UpdateResult<T>(this IDatabaseInterface db,
            T model, CancellationToken token = default) where T : DbModel
        {
            return (await model.Update(db)).Map(x => x as T);
        }
    }
}