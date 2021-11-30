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
        private readonly IDatabaseInterface _db;
        private readonly IMediatorResult _mediator;

        public BetsController(IDatabaseInterface db, IMediatorResult mediator)
        {
            _db = db;
            _mediator = mediator;
        }


        [HttpGet]
        [Authorize]
        [Route("Bets")]
        public async Task<ActionResult<List<Bet>>> GetBets()
        {
            var result = await _mediator.Send(new BetsByUserQuery()
            {
                Email = GetEmailFromClaims()
            });

            return ToResponse(result);
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

        [HttpPost]
        [Authorize]
        [Route("Bets")]
        public async Task<ActionResult<Bet>> CreateBet(Bet bet)
        {
            var cmd = new CreateBetCommand()
            {
                Title = bet.Title,
                Description = bet.Description,
                GroupId = bet.GroupId.ToString()
            };

            var result = await (await _mediator.Send(cmd))
                .Bind(() => _db.LoadSingleById<Bet>(cmd.BetId));

            return ToResponse(result);
        }
    }
}