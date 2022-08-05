using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class TransferTokensCommand : AbstractCommand<TransferTokensCommand>
    {
        public string BetId { get; init; }
        public string Address { get; set; }
    }

    public class TransferTokensCommandHandler : ICommandHandler<TransferTokensCommand>
    {
        private readonly IContracts _contract;

        public TransferTokensCommandHandler(IContracts contract)
        {
            _contract = contract;
        }

        public async Task<Result> Handle(TransferTokensCommand cmd)
        {
            return await _contract.TransferTokens(cmd.BetId, new[] { cmd.Address });
        }

        public Task<Result> Handle(TransferTokensCommand request, CancellationToken cancellationToken)
        {
           return Handle(request);
        }
    }
}