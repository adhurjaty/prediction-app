using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi {
    public interface IDbStrategy<T>
    {
        Task<Result> LoadReferences(T model, CancellationToken token = default);
        Task<Result<long>> Insert(T model, CancellationToken token = default);
        Task<Result<int>> Update(T model, CancellationToken token = default);
        Task<Result<int>> Delete(T model, CancellationToken token = default);
    }
}