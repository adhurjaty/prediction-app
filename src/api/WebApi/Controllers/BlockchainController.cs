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
        private readonly ContractFactory _factory;

        public BlockchainController(ILogger<BlockchainController> logger,
            IWeb3 blockchain, ContractFactory factory)
        {
            _logger = logger;
            _blockchain = blockchain;
            _factory = factory;
        }

        [HttpGet]
        public async Task<string> Get()
        {
            var contractInfo = _factory.GetContractInfo("EqualAnteProposition");
            var resp = await _blockchain.Deploy(contractInfo);
            
            return resp;
        }
    }

    public class Balance
    {
        public float Wei { get; set; }
        public decimal Ether { get; set; }
    }
}
