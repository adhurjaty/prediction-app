using System.Collections.Generic;
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
        Task<Result> CreateFullComposer(string betId, int numMembers);
        Task<Result> CreateWinLosePayout(string betId);
        Task<Result> CreateYesNoBet(string betId);
        Task<Result> CreateAllBetsCloser(string betId, int numMembers);
        Task<Result> CreateYesNoResolver(string betId, int numMembers);
        Task<Result> CreateComposer(string betId);
        Task<Result> Resolve(string betId);
    }

    public class ContractsInterface : IContracts
    {
        private readonly IFlow _flow;
        private readonly string _delphaiAddress;
        private readonly Dictionary<string, string> _additionalContracts;

        private ContractsInterface(FlowInterface flow, 
            Dictionary<string, string> additionalContracts)
        {
            _flow = flow;
            _delphaiAddress = flow.AccountAddress;
            _additionalContracts = additionalContracts;
        }

        public static async Task<ContractsInterface> CreateInstance(FlowConfig config)
        {
            return new ContractsInterface(await FlowInterface.CreateInstance(config),
                config.AdditionalContracts ?? new Dictionary<string, string>());
        }

        public ContractsInterface(IFlow flow, string delphaiAddress, 
            Dictionary<string, string> additionalContracts)
        {
            _flow = flow;
            _delphaiAddress = delphaiAddress;
            _additionalContracts = additionalContracts;
        }

        public async Task<Result> CreateFullComposer(string betId, int numMembers)
        {
            var arguments = new List<ICadence>()
            {
                new CadenceString(ToCadenceId(betId)),
                new CadenceNumber(CadenceNumberType.Int, numMembers.ToString())
            };
            var addressMap = new Dictionary<string, string>()
            {
                { "delphai", _delphaiAddress },
                { "FUSD", _additionalContracts.GetValueOrDefault("FUSD", _delphaiAddress) }
            };

            try
            {
                await _flow.ExecuteTransaction("createFullComposer", arguments, 
                    addressMap);
                return Result.Succeeded();
            }
            catch (FlowException ex)
            {
                return Result.Failed(ex.Message);
            }
        }

        public async Task<Result> CreateWinLosePayout(string betId)
        {
            var arguments = new List<ICadence>()
            {
                new CadenceString(ToCadenceId(betId)),
            };
            var addressMap = new Dictionary<string, string>()
            {
                { "delphai", _delphaiAddress },
                { "FUSD", _additionalContracts.GetValueOrDefault("FUSD", _delphaiAddress) }
            };

            try
            {
                await _flow.ExecuteTransaction("createWinLosePayoutFUSD", arguments, 
                    addressMap);
                return Result.Succeeded();
            }
            catch (FlowException ex)
            {
                return Result.Failed(ex.Message);
            }
        }

        public async Task<Result> CreateYesNoBet(string betId)
        {
            var arguments = new List<ICadence>()
            {
                new CadenceString(ToCadenceId(betId)),
            };
            var addressMap = new Dictionary<string, string>()
            {
                { "delphai", _delphaiAddress },
                { "FUSD", _additionalContracts.GetValueOrDefault("FUSD", _delphaiAddress) }
            };

            try
            {
                await _flow.ExecuteTransaction("createYesNoBetFUSD", arguments, addressMap);
                return Result.Succeeded();
            }
            catch (FlowException ex)
            {
                return Result.Failed(ex.Message);
            }
        }

        public async Task<Result> CreateAllBetsCloser(string betId, int numMembers)
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
                await _flow.ExecuteTransaction("createAllBetsCloser", arguments, 
                    addressMap);
                return Result.Succeeded();
            }
            catch (FlowException ex)
            {
                return Result.Failed(ex.Message);
            }
        }

        public async Task<Result> CreateYesNoResolver(string betId, int numMembers)
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
                await _flow.ExecuteTransaction("createYesNoResolver", arguments, 
                    addressMap);
                return Result.Succeeded();
            }
            catch (FlowException ex)
            {
                return Result.Failed(ex.Message);
            }
        }

        public async Task<Result> CreateComposer(string betId)
        {
            var arguments = new List<ICadence>()
            {
                new CadenceString(ToCadenceId(betId)),
            };
            var addressMap = new Dictionary<string, string>()
            {
                { "delphai", _delphaiAddress }
            };

            try
            {
                await _flow.ExecuteTransaction("createComposer", arguments, addressMap);
                return Result.Succeeded();
            }
            catch (FlowException ex)
            {
                return Result.Failed(ex.Message);
            }
        }

        public async Task<Result> Resolve(string betId)
        {
            var arguments = new List<ICadence>()
            {
                new CadenceString(ToCadenceId(betId)),
            };
            var addressMap = new Dictionary<string, string>()
            {
                { "delphai", _delphaiAddress }
            };

            try
            {
                await _flow.ExecuteTransaction("resolve", arguments, addressMap);
                return Result.Succeeded();
            }
            catch (FlowException ex)
            {
                return Result.Failed(ex.Message);
            }
        }

        // not in the interface. Should only be used in script or testing
        public async Task<Result<FlowAccount>> CreateAccount(FlowAccountKey key)
        {
            try
            {
                var flow = _flow as FlowInterface;
                var account = await flow.CreateAccount(key);
                await flow.ExecuteTransaction("setupFlowAccount", account);
                await flow.ExecuteTransaction("setupFUSDAccount", account,
                    addressMap: new Dictionary<string, string>()
                    {
                        { "FUSD", _additionalContracts.GetValueOrDefault("FUSD", _delphaiAddress) }
                    });
                return Result.Succeeded(account);
            }
            catch (FlowException ex)
            {
                return Result.Failed<FlowAccount>(ex.Message);
            }
        }

        // not in the interface. Should only be used for the script program
        public async Task<Result> SetupDelphaiUser(FlowAccount account)
        {
            try
            {
                var flow = _flow as FlowInterface;
                await flow.ExecuteTransaction("setupFullUser", account, 
                    addressMap: new Dictionary<string, string>()
                    {
                        { "delphai", _delphaiAddress }
                    });
                return Result.Succeeded();
            }
            catch (FlowException ex)
            {
                return Result.Failed(ex.Message);
            }
        }

        // not in the interface. Should only be used for the script program
        public async Task<Result> TransferFlow(FlowAddress receiver, decimal amount)
        {
            return await TransferFungibleTokens("Flow", receiver, amount);
        }

        // not in the interface. Should only be used for the script program
        public async Task<Result> TransferFUSD(FlowAddress receiver, decimal amount)
        {
            return await TransferFungibleTokens("FUSD", receiver, amount,
                new Dictionary<string, string>()
                {
                    { "FUSD", _additionalContracts.GetValueOrDefault("FUSD", _delphaiAddress) }
                });
        }

        private async Task<Result> TransferFungibleTokens(string tokenName, FlowAddress receiver, 
            decimal amount, Dictionary<string, string> addressMap = null)
        {
            try
            {
                await _flow.ExecuteTransaction($"transfer{tokenName}", new List<ICadence>()
                {
                    new CadenceAddress(receiver.HexValue),
                    new CadenceNumber(CadenceNumberType.UFix64, amount.ToString("0.0"))
                }, addressMap: addressMap);
                return Result.Succeeded();
            }
            catch (FlowException ex)
            {
                return Result.Failed(ex.Message);
            }
        }

        // not in the interface. Should only be used for the script program
        public async Task<Result> MintFUSD()
        {
            var addressMap = new Dictionary<string, string>()
            {
                { "FUSD", _delphaiAddress }
            };
            try
            {
                await _flow.ExecuteTransaction("setupFUSDAccount", addressMap: addressMap);
                await _flow.ExecuteTransaction("mintFUSD", addressMap: addressMap);
                return Result.Succeeded();
            }
            catch (FlowException ex)
            {
                return Result.Failed(ex.Message);
            }
        }

        private static string ToCadenceId(string id)
        {
            return $"{id.Replace("-", "")}";
        }
    }
}