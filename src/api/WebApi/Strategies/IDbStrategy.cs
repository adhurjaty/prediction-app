using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi {
    public interface IDbStrategy<T>
    {
        Task<Result> LoadReferences(IDatabaseInterface db, T model, CancellationToken token = default);
        Task<Result<long>> Insert(IDatabaseInterface db, T model, CancellationToken token = default);
        Task<Result<int>> Update(IDatabaseInterface db, T model, CancellationToken token = default);
        Task<Result<int>> Delete(IDatabaseInterface db, T model, CancellationToken token = default);
    }
}