using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Flow.Net.Sdk.Cadence;
using Flow.Net.Sdk.Exceptions;
using Infrastructure;

namespace WebApi
{
    public interface IContracts
    {
        Task<Result> TransferTokens(string betId, IEnumerable<string> members);
        Task<Result> DeployComposerBet(string betId, int numMembers);
    }

    public class ContractsInterface : IContracts
    {
        private readonly IFlow _flow;
        private readonly string _delphaiAddress;

        public ContractsInterface(FlowConfig config)
        {
            _flow = new FlowInterface(config);
            _delphaiAddress = config.AccountHash;
        }

        public async Task<Result> TransferTokens(string betId, 
            IEnumerable<string> members)
        {
            var memberArguments = members.Select(member => 
                new CadenceAddress(member) as ICadence);
            var arguments = new List<ICadence>()
            {
                new CadenceString(betId),
                new CadenceArray(memberArguments.ToList())
            };
            var addressMap = new Dictionary<string, string>()
            {
                { "Delphai", _delphaiAddress }
            };

            try
            {
                await _flow.ExecuteTransaction("transferTokens", arguments.ToList(),
                    addressMap);
                return Result.Succeeded();
            }
            catch(FlowException ex)
            {
                return Result.Failed(ex.Message);
            }
        }

        public async Task<Result> DeployComposerBet(string betId, int numMembers)
        {
            var arguments = new List<ICadence>()
            {
                new CadenceString(betId),
                new CadenceNumber(CadenceNumberType.Int, numMembers.ToString())
            };
            var addressMap = new Dictionary<string, string>()
            {
                { "Delphai", _delphaiAddress }
            };

            try
            {
                await _flow.ExecuteTransaction("deployComposerBet", arguments,
                    addressMap);
                return Result.Succeeded();
            }
            catch (FlowException ex)
            {
                return Result.Failed(ex.Message);
            }
        }
    }
}