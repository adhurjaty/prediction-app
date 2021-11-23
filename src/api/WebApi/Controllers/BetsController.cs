using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi
{
    [ApiController]
    public class BetsController : BragControllerBase
    {
        [HttpGet]
        [Authorize]
        [Route("Bets/{betId}")]
        public async Task<ActionResult<Bet>> GetBet(string betId)
        {
            
        }
    }
}