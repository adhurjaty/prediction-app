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
        public AppUser User { get; set; }
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
                User = cmd.User,
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
                    return await (await CreateBetContracts(bet.Id.ToString(), group))
                        .Either(
                            x => Task.FromResult(x),
                            async result => 
                            {
                                // rollback if deploy to blockchain failed
                                await _db.Delete(bet);
                                return Result.Failed<(Bet, Group)>($"Could not deploy contract to blockchain: {result.Failure}");
                            });
                });
        }

        private async Task<Result> CreateBetContracts(string betId, Group group)
        {
            // TODO: set up rollbacks if any of these fail
            return await (await (await (await _contract.CreateWinLosePayout(betId))
                .Bind(() => _contract.CreateYesNoBet(betId)))
                .Bind(() => _contract.CreateYesNoResolver(betId, group.Users.Count)))
                .Bind(() => _contract.CreateComposer(betId));
        }

        public Task<Result> Handle(CreateBetCommand request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}