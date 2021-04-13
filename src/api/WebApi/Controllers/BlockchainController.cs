using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Nethereum.Web3;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BlockchainController : ControllerBase
    {
        private readonly ILogger<BlockchainController> _logger;
        private readonly IWeb3 _blockchain;
        private readonly EqualAntePropositionDeploy _contract;

        public BlockchainController(ILogger<BlockchainController> logger,
            IWeb3 blockchain, EqualAntePropositionDeploy contract)
        {
            _logger = logger;
            _blockchain = blockchain;
            _contract = contract;
        }

        [HttpGet]
        public async Task<string> Get()
        {
            return await _blockchain.DeployEqualAnte(_contract);
            // var resp = await _blockchain.GetBalance();
            
            // return $"Balance: {resp}";
        }
    }

    public class Balance
    {
        public float Wei { get; set; }
        public decimal Ether { get; set; }
    }
}
