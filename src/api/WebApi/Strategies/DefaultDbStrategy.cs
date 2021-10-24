using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class DefaultDbStrategy<T> : IDbStrategy<T>
    {
        public async Task<Result<int>> Delete(IDatabaseInterface db, T model, CancellationToken token = default)
        {
            return await db.Delete(model, token);
        }

        public async Task<Result<long>> Insert(IDatabaseInterface db, T model, CancellationToken token = default)
        {
            return await db.Insert(model, token);
        }

        public Task<Result> LoadReferences(IDatabaseInterface db, T model, CancellationToken token = default)
        {
            return Task.FromResult(Result.Succeeded());
        }

        public async Task<Result<int>> Update(IDatabaseInterface db, T model, CancellationToken token = default)
        {
            return await db.Update(model, token);
        }
    }
}