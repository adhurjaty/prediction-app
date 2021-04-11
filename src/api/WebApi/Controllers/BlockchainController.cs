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

        public BlockchainController(ILogger<BlockchainController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<Balance> Get()
        {
            var web3 = new Web3("http://localhost:7545");
            var wei = await web3.Eth.GetBalance.SendRequestAsync("0xbD2FbFeA4971DA2BF59957D48260ae9Cd8066Bc6");
            
            return new Balance()
            {
                Ether = Web3.Convert.FromWei(wei.Value)
            };
        }
    }

    public class Balance
    {
        public float Wei { get; set; }
        public decimal Ether { get; set; }
    }
}
