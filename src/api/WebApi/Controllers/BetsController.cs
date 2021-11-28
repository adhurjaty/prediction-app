using System.Collections.Generic;
using System.Threading.Tasks;
using Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi
{
    [ApiController]
    public class BetsController : BragControllerBase
    {
        private readonly IMediatorResult _mediator;

        public BetsController(IMediatorResult mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Authorize]
        [Route("Bets")]
        public async Task<ActionResult<List<Bet>>> GetBets()
        {
            
        }
        
        [HttpGet]
        [Authorize]
        [Route("Bets/{betId}")]
        public async Task<ActionResult<Bet>> GetBet(string betId)
        {
            var result = await _mediator.Send(new BetByIdQuery()
            {
                Id = betId
            });

            return ToResponse(result);
        }
    }
}