using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public interface IContractDeployer
    {
        Task<Result> Deploy(string betAddress, string resolverAddress);
    }
}