using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class BetsByGroupQuery : AbstractQuery<BetsByGroupQuery, List<Bet>>
    {
        public string GroupId { get; init; }
    }

    public class BetsByGroupQueryHandler : IQueryHandler<BetsByGroupQuery, List<Bet>>
    {
        private readonly IDatabaseInterface _db;

        public BetsByGroupQueryHandler(IDatabaseInterface db)
        {
            _db = db;
        }

        public async Task<Result<List<Bet>>> Handle(BetsByGroupQuery query)
        {
            return await _db.Select<Bet>(x => x.GroupId.ToString() == query.GroupId);
        }

        public Task<Result<List<Bet>>> Handle(BetsByGroupQuery request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}