using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.Data;

namespace WebApi
{
    public class ModelsDatbaseInterface : DatabaseInterface, IDatabaseInterface
    {
        private readonly IDbStrategyFactory _strategyFactory;

        public ModelsDatbaseInterface(IDbConnectionFactory dbFactory, 
            IDbStrategyFactory strategyFactory) : base(dbFactory)
        {
            _strategyFactory = strategyFactory;
        }

        public new async Task<Result> LoadReferences<T>(T model, CancellationToken token = default)
        {
            var strategy = _strategyFactory.Get<T>();
            return await strategy.LoadReferences(model, token);
        }

        public new async Task<Result<long>> Insert<T>(T model, CancellationToken token = default)
        {
            var strategy = _strategyFactory.Get<T>();
            return await strategy.Insert(model, token);
        }

        public new async Task<Result<int>> Update<T>(T model, CancellationToken token = default)
        {
            var strategy = _strategyFactory.Get<T>();
            return await strategy.Update(model, token);
        }

        public new async Task<Result<int>> Delete<T>(T model, CancellationToken token = default)
        {
            var strategy = _strategyFactory.Get<T>();
            return await strategy.Delete(model, token);
        }
    }
}