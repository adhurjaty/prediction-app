using System;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public interface IContractDeployer
    {
        // I don't think this interface is right, but using for now
        Task<Result> Deploy(string betAddress, string resolverAddress);
    }

    public class DummyContractDeployer : IContractDeployer
    {
        public Task<Result> Deploy(string betAddress, string resolverAddress)
        {
            Console.WriteLine($"Deployed contract with bet address {betAddress} and resolver address {resolverAddress}");
            return Task.FromResult(Result.Succeeded());
        }
    }
}