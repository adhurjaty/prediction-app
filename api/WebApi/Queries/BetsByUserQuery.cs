using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class BetsByUserQuery : AbstractQuery<BetsByUserQuery, List<Bet>>
    {
        public AppUser User { get; init; }
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
                .Where<AppUser>(u => u.Id == query.User.Id);

            var resolvedBetsResultTask = _db.LoadSelect<Bet>(sqlQuery);

            // get open bets from user's groups
            return (await (await (await _mediator.Send(new GroupsByUserQuery()
            {
                User = query.User
            }))
                .Bind(groups => groups.Select(group => _mediator.Send(new BetsByGroupQuery()
                {
                    GroupId = group.Id.ToString()
                })).Aggregate()))
                .Map(x => x.SelectMany(y => y)
                    .Where(y => !y.UserBetResults?.Any() ?? true))
                .TupleBind(_ => resolvedBetsResultTask))
                .Map((openBets, closedBets) => openBets.Concat(closedBets).ToList());
        }

        public Task<Result<List<Bet>>> Handle(BetsByUserQuery request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}