using System.Threading.Tasks;
using Nethereum.Web3;

namespace WebApi
{
    public interface IWeb3
    {
        Task<string> Deploy(DeployableContractInfo info);
    }

    public class Web3Wrapper : IWeb3
    {
        private readonly Web3 _wrapped;
        private readonly BlockchainSettings _settings;

        public Web3Wrapper(BlockchainSettings settings)
        {
            _wrapped = new Web3(settings.Url);
            _settings = settings;
        }

        public async Task<string> Deploy(DeployableContractInfo info)
        {
            return await _wrapped.Eth.DeployContract.SendRequestAsync(
                info.Abi, info.Bin, _settings.UserAddress);
        }
    }
}