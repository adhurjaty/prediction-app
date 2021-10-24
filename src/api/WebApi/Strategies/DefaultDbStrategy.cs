using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class DefaultDbStrategy<T> : IDbStrategy<T>
    {
        public virtual async Task<Result<int>> Delete(IDatabaseInterface db, T model, CancellationToken token = default)
        {
            return await db.Delete(model, token);
        }

        public virtual async Task<Result<long>> Insert(IDatabaseInterface db, T model, CancellationToken token = default)
        {
            return await db.Insert(model, token);
        }

        public virtual Task<Result> LoadReferences(IDatabaseInterface db, T model, CancellationToken token = default)
        {
            return Task.FromResult(Result.Succeeded());
        }

        public virtual async Task<Result<int>> Update(IDatabaseInterface db, T model, CancellationToken token = default)
        {
            return await db.Update(model, token);
        }
    }
}