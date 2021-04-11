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
        private readonly BlockchainSettings _settings;

        public BlockchainController(ILogger<BlockchainController> logger,
            BlockchainSettings settings)
        {
            _logger = logger;
            _settings = settings;
        }

        [HttpGet]
        public async Task<Balance> Get()
        {
            var web3 = new Web3(_settings.Url);
            var wei = await web3.Eth.GetBalance.SendRequestAsync(
                _settings.UserAddress);
            
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
