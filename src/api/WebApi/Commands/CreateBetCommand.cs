using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class CreateBetCommand : AbstractCommand<CreateBetCommand>
    {
        public string Title { get; init; }
        public string Description { get; init; }
        public string GroupId { get; init; }

        // output property
        public string BetId { get; set; }
    }

    public class CreateBetCommandHandler : ICommandHandler<CreateBetCommand>
    {
        private readonly IDatabaseInterface _db;

        public CreateBetCommandHandler(IDatabaseInterface db)
        {
            _db = db;
        }

        public async Task<Result> Handle(CreateBetCommand cmd)
        {
            // insert into blockchain

            // insert into db
            return (await _db.InsertResult(new Bet()
            {
                Title = cmd.Title,
                Description = cmd.Description,
                GroupId = cmd.GroupId
            })).Tee(bet => cmd.BetId = bet.Id.ToString());
        }

        public Task<Result> Handle(CreateBetCommand request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}