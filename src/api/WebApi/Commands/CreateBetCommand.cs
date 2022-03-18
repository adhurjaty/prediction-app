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
        public string Email { get; set; }
        public DateTime CloseTime { get; set; }

        // output property
        public string BetId { get; set; }
    }

    public class CreateBetCommandHandler : ICommandHandler<CreateBetCommand>
    {
        private readonly IDatabaseInterface _db;
        private readonly IMediatorResult _mediator;
        private readonly IContracts _contract;

        public CreateBetCommandHandler(IDatabaseInterface db,
            IMediatorResult mediator,
            IContracts contract)
        {
            _db = db;
            _mediator = mediator;
            _contract = contract;
        }

        public async Task<Result> Handle(CreateBetCommand cmd)
        {
            var groupResult = _mediator.Send(new GroupByIdQuery()
            {
                Email = cmd.Email,
                GroupId = cmd.GroupId
            });
            return await (await (await
                _db.InsertResult(new Bet()
                {
                    Title = cmd.Title,
                    Description = cmd.Description,
                    CloseTime = cmd.CloseTime,
                    GroupId = Guid.Parse(cmd.GroupId)
                }))
                .Tee(bet => cmd.BetId = bet.Id.ToString())
                .TupleBind(_ => groupResult))
                .TeeResult(async (bet, group) =>
                {
                    return await new Task<Result>[]
                    {
                        _contract.DeployComposerBet(bet.Id.ToString(), group.Users.Count),
                        _contract.TransferTokens(bet.Id.ToString(),
                            group.Users.Select(user => user.MainnetAddress))
                    }.Aggregate();
                });
        }

        public Task<Result> Handle(CreateBetCommand request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}