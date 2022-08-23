using System.Collections.Generic;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class DummyContractsInterface : IContracts
    {
        public Task<Result> CreateWinLosePayout(string betId)
        {
            return Task.FromResult(Result.Failed("Using dummy implementation"));
        }

        public Task<Result> CreateYesNoBet(string betId)
        {
            return Task.FromResult(Result.Failed("Using dummy implementation"));
        }

        public Task<Result> CreateYesNoResolver(string betId, int numMembers)
        {
            return Task.FromResult(Result.Failed("Using dummy implementation"));
        }

        public Task<Result> CreateComposer(string betId)
        {
            return Task.FromResult(Result.Failed("Using dummy implementation"));
        }
    }
}