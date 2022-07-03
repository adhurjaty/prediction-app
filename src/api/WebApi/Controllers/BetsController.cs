using System;
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

        public BetsController(IDatabaseInterface db, IMediatorResult mediator)
            : base(mediator)
        {
            _db = db;
        }


        [HttpGet]
        [Authorize]
        [Route("Bets")]
        public async Task<ActionResult<List<Bet>>> GetBets()
        {
            var result = await GetUserFromClaims()
                .Bind(user => _mediator.Send(new BetsByUserQuery()
                {
                    User = user
                }));

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
        public async Task<ActionResult<Bet>> CreateBet(CreateBetRequest request)
        {
            var result = await (await GetUserFromClaims()
                .Map(user => new CreateBetCommand()
                {
                    Title = request.Title,
                    Description = request.Description,
                    GroupId = request.GroupId,
                    CloseTime = request.CloseTime,
                    User = user
                })
                .TeeResult(cmd => _mediator.Send(cmd)))
                .Bind(cmd => _db.LoadSingleById<Bet>(cmd.BetId));

            return ToResponse(result);
        }
    }

    public class CreateBetRequest : Bet
    {
        public string BetAddress { get; set; }
        public string ResolverAddress { get; set; }
        public new string GroupId { get; set; }
    }
}