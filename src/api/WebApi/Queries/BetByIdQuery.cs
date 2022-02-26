using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class BetByIdQuery : AbstractQuery<BetByIdQuery, Bet>
    {
        public string Id { get; init; }
    }

    public class BetByIdQueryHandler : IQueryHandler<BetByIdQuery, Bet>
    {
        private readonly IDatabaseInterface _db;

        public BetByIdQueryHandler(IDatabaseInterface db)
        {
            _db = db;
        }

        public async Task<Result<Bet>> Handle(BetByIdQuery query)
        {
            return await _db.LoadSingleById<Bet>(query.Id);
        }

        public Task<Result<Bet>> Handle(BetByIdQuery request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}