using System;
using System.Linq;
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
        private readonly IContracts _contract;

        public CreateBetCommandHandler(IDatabaseInterface db,
            IContracts contract)
        {
            _db = db;
            _contract = contract;
        }

        public async Task<Result> Handle(CreateBetCommand cmd)
        {
            var groupResult = _db.LoadSingleById<Group>(cmd.GroupId);
            return await (await (await (await 
                _db.InsertResult(new Bet()
                {
                    Title = cmd.Title,
                    Description = cmd.Description,
                    GroupId = Guid.Parse(cmd.GroupId)
                }))
                .Tee(bet => cmd.BetId = bet.Id.ToString())
                .TupleBind(_ => groupResult))
                .TeeResult((bet, group) =>
                    _contract.DeployComposerBet(bet.Id.ToString(), group.Users.Count)))
                .TeeResult((bet, group) =>
                    _contract.TransferTokens(bet.Id.ToString(),
                        group.Users.Select(user => user.MainnetAddress)));
        }

        public Task<Result> Handle(CreateBetCommand request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}