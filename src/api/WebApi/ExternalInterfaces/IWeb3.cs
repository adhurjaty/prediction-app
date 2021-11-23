using System.Threading.Tasks;
using Nethereum.Web3.Accounts;
using Nethereum.Web3;
using Nethereum.Contracts;

namespace WebApi
{
    public interface IWeb3
    {
        Task<string> Deploy(DeployableContractInfo info);
        Task<string> DeployEqualAnte(EqualAntePropositionDeploy msg);
        Task<decimal> GetBalance();
        Task<Contract> GetContract(string abi, string address);
    }

    public class Web3Wrapper : IWeb3
    {
        private readonly Web3 _wrapped;
        private readonly BlockchainSettings _settings;

        public Web3Wrapper(BlockchainSettings settings)
        {
            var acct = new Account(settings.PrivateKey);
            _wrapped = new Web3(acct, settings.Url);
            _settings = settings;
        }

        public async Task<string> Deploy(DeployableContractInfo info)
        {
            return await _wrapped.Eth.DeployContract.SendRequestAsync(
                info.Abi, info.Bin, _settings.UserAddress);
        }

        public async Task<string> DeployEqualAnte(EqualAntePropositionDeploy msg)
        {
            var handler = _wrapped.Eth.GetContractDeploymentHandler<EqualAntePropositionDeploy>();
            var receipt = await handler.SendRequestAndWaitForReceiptAsync(msg);
            return receipt.ContractAddress;
        }

        public async Task<decimal> GetBalance()
        {
            var wei = await _wrapped.Eth.GetBalance.SendRequestAsync(_settings.UserAddress);
            return Web3.Convert.FromWei(wei.Value);
        }

        public async Task<Contract> GetContract(string abi, string address)
        {
            return await Task.Run(() => _wrapped.Eth.GetContract(abi, address));
        }
    }
}