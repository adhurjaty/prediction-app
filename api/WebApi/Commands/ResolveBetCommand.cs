using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi {
    public class ResolveBetCommand : AbstractCommand<ResolveBetCommand>
    {
        public string BetId { get; init; }
    }

    public class ResolveBetCommandHandler : ICommandHandler<ResolveBetCommand>
    {
        private readonly IContracts _contract;

        public ResolveBetCommandHandler(IContracts contract)
        {
            _contract = contract;
        }

        public async Task<Result> Handle(ResolveBetCommand cmd)
        {
            return await _contract.Resolve(cmd.BetId);
        }

        public Task<Result> Handle(ResolveBetCommand request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}