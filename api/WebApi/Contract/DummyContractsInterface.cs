using System.Collections.Generic;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class DummyContractsInterface : IContracts
    {
        public Task<Result> DeployComposerBet(string betId, int numMembers)
        {
            return Task.FromResult(Result.Failed("Using dummy implementation"));
        }

        public Task<Result> TransferTokens(string betId, IEnumerable<string> members)
        {
            return Task.FromResult(Result.Failed("Using dummy implementation"));
        }
    }
}