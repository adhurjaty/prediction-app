using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class BetsByUserQuery : AbstractQuery<BetsByUserQuery, List<Bet>>
    {
        public string Email { get; init; }
    }

    public class BetsByUserQueryHandler : IQueryHandler<BetsByUserQuery, List<Bet>>
    {
        private readonly IDatabaseInterface _db;
        private readonly IMediatorResult _mediator;

        public BetsByUserQueryHandler(IDatabaseInterface db, IMediatorResult mediator)
        {
            _db = db;
            _mediator = mediator;
        }

        public async Task<Result<List<Bet>>> Handle(BetsByUserQuery query)
        {
            // get resolved bets involving user
            var sqlQuery = _db.From<Bet>()
                .Join<Bet, UserBetResult>((b, ubr) => ubr.BetId == b.Id)
                .Join<UserBetResult, AppUser>((ubr, u) => ubr.UserId == u.Id)
                .Where<AppUser>(u => u.Email == query.Email);

            var resolvedBetsResultTask = _db.LoadSelect<Bet>(sqlQuery);

            // get open bets from user's groups
            return (await (await (await _mediator.Send(new GroupsByUserQuery()
            {
                Email = query.Email
            }))
                .Bind(groups => groups.Select(group => _mediator.Send(new BetsByGroupQuery()
                {
                    GroupId = group.Id.ToString()
                })).Aggregate()))
                .Map(x => x.SelectMany(y => y))
                .TupleBind(_ => resolvedBetsResultTask))
                .Map((openBets, closedBets) => openBets.Concat(closedBets).ToList());
        }

        public Task<Result<List<Bet>>> Handle(BetsByUserQuery request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}