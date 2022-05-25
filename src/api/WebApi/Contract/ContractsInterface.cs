using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Flow.Net.Sdk.Cadence;
using Flow.Net.Sdk.Exceptions;
using Flow.Net.Sdk.Models;
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

        private ContractsInterface(FlowInterface flow)
        {
            _flow = flow;
            _delphaiAddress = flow.AccountAddress;
        }

        public static async Task<ContractsInterface> CreateInstance(FlowConfig config)
        {
            return new ContractsInterface(await FlowInterface.CreateInstance(config));
        }

        public ContractsInterface(IFlow flow, string delphaiAddress)
        {
            _flow = flow;
            _delphaiAddress = delphaiAddress;
        }

        public async Task<Result> TransferTokens(string betId, 
            IEnumerable<string> members)
        {
            var memberArguments = members.Select(member => 
                new CadenceAddress(member) as ICadence);
            var arguments = new List<ICadence>()
            {
                new CadenceString(ToCadenceId(betId)),
                new CadenceArray(memberArguments.ToList())
            };
            var addressMap = new Dictionary<string, string>()
            {
                { "delphai", _delphaiAddress }
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
                new CadenceString(ToCadenceId(betId)),
                new CadenceNumber(CadenceNumberType.Int, numMembers.ToString())
            };
            var addressMap = new Dictionary<string, string>()
            {
                { "delphai", _delphaiAddress }
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

        private static string ToCadenceId(string id)
        {
            return id.Replace("-", "");
        }

        // not in the interface. Should only be used for the script program
        public async Task<Result<string>> CreateAccount(string publicKey, string privateKey)
        {
            try
            {
                var accountResult = await _flow.CreateAccount(publicKey, privateKey);
                return Result.Succeeded(accountResult.Events
                    .Where(x => x.Type == "flow.AccountKeyAdded")
                    .Select(x => x.Payload as CadenceComposite)
                    .Select(x => x.Value.Fields
                        .Where(y => y.Name == "address")
                        .Select(y => (y.Value as CadenceAddress).Value)
                        .FirstOrDefault())
                    .FirstOrDefault());
            }
            catch (FlowException ex)
            {
                return Result.Failed<string>(ex.Message);
            }
        }
    }
}