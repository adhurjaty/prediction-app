using System;
using System.Threading.Tasks;
using System.Data;
using ServiceStack.OrmLite;
using System.Collections.Generic;
using System.Threading;
using System.Linq.Expressions;

namespace Infrastructure
{
    public static class DatabaseExtensions
    {
        public static async Task<Result<T>> SingleResult<T>(this IDbConnection db,
            Expression<Func<T, bool>> expr, CancellationToken token = default)
        {
            var result = await db.SingleAsync(expr, token);
            return result != null 
                ? Result<T>.Succeeded(result)
                : Result<T>.Failed("No matching result");
        }

        public static async Task<Result<T>> SingleResultById<T>(this IDbConnection db,
            Guid idValue, CancellationToken token = default)
        {
            var result = await db.SingleByIdAsync<T>(idValue, token);
            return result != null 
                ? Result<T>.Succeeded(result)
                : Result<T>.Failed("No matching result");
        }

        public static async Task<Result<T>> SingleResultById<T>(this IDbConnection db,
            string idValue, CancellationToken token = default)
        {
            return await db.SingleResultById<T>(Guid.Parse(idValue), token);
        }

        public static async Task<Result<List<T>>> SelectResult<T>(this IDbConnection db,
            Expression<Func<T, bool>> expr, CancellationToken token = default)
        {
            var result = await db.SelectAsync(expr, token);
            return Result<List<T>>.Succeeded(result ?? new List<T>());
        }

        public static async Task<Result<List<T>>> SelectResult<T>(this IDbConnection db,
            SqlExpression<T> expr, CancellationToken token = default)
        {
            var result = await db.SelectAsync(expr, token);
            return Result<List<T>>.Succeeded(result ?? new List<T>());
        }

        public static async Task<Result<T>> InsertResult<T>(this IDbConnection db, 
            T model, CancellationToken token = default) where T : DbModel
        {
            model.Id = Guid.NewGuid();
            await db.InsertAsync(model, token: token);
            return Result.Succeeded(model);
        }
    }
}