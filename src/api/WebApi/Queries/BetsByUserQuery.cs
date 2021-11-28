using System.Collections.Generic;
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

        public Task<Result<List<Bet>>> Handle(BetsByUserQuery query)
        {
            throw new System.NotImplementedException();
        }

        public Task<Result<List<Bet>>> Handle(BetsByUserQuery request, CancellationToken cancellationToken)
        {
            throw new System.NotImplementedException();
        }
    }
}