using System;
using System.Threading.Tasks;
using System.Data;
using ServiceStack.OrmLite;
using System.Collections.Generic;
using System.Threading;

namespace Infrastructure
{
    public static class DatabaseExtensions
    {
        public static async Task<Result<T>> SingleResult<T>(this IDbConnection db,
            ISqlExpression expr, CancellationToken token = default)
        {
            var result = await db.SingleAsync<T>(expr, token);
            return result is null 
                ? Result<T>.Succeeded(result)
                : Result<T>.Failed("No matching result");
        }

        public static async Task<Result<T>> SingleResultById<T>(this IDbConnection db,
            object idValue, CancellationToken token = default)
        {
            var result = await db.SingleByIdAsync<T>(idValue, token);
            return result is null 
                ? Result<T>.Succeeded(result)
                : Result<T>.Failed("No matching result");
        }

        public static async Task<Result<List<T>>> SelectResult<T>(this IDbConnection db,
            ISqlExpression expr, CancellationToken token = default)
        {
            var result = await db.SelectAsync<T>(expr, token);
            return Result<List<T>>.Succeeded(result);
        }
    }
}