using System;
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
        public string BetAddress { get; set; }
        public string ResolverAddress { get; set; }

        // output property
        public string BetId { get; set; }
    }

    public class CreateBetCommandHandler : ICommandHandler<CreateBetCommand>
    {
        private readonly IDatabaseInterface _db;
        private readonly IContractDeployer _contract;

        public CreateBetCommandHandler(IDatabaseInterface db,
            IContractDeployer contract)
        {
            _db = db;
            _contract = contract;
        }

        public async Task<Result> Handle(CreateBetCommand cmd)
        {
            return (await (await _contract.Deploy(cmd.BetAddress, cmd.ResolverAddress))
                .Bind(() => _db.InsertResult(new Bet()
                {
                    Title = cmd.Title,
                    Description = cmd.Description,
                    GroupId = Guid.Parse(cmd.GroupId)
                }))).Tee(bet => cmd.BetId = bet.Id.ToString());
        }

        public Task<Result> Handle(CreateBetCommand request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}