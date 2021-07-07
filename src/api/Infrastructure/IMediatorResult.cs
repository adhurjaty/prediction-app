using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace Infrastructure
{
public interface IMediatorResult
    {
        Task<Result<TResult>> Send<TQuery, TResult>(AbstractQuery<TQuery, TResult> query,
            CancellationToken token = default);

        Task<Result> Send<TCommand>(AbstractCommand<TCommand> cmd, 
            CancellationToken token = default);
    }

    public class MediatorRailway : IMediatorResult
    {
        private readonly IMediator _mediator;

        public MediatorRailway(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<Result<TResult>> Send<TQuery, TResult>(
            AbstractQuery<TQuery, TResult> query, CancellationToken token = default)
        {
            return await _mediator.Send(query, token) as Result<TResult>;
        }

        public async Task<Result> Send<TCommand>(AbstractCommand<TCommand> cmd, 
            CancellationToken token = default)
        {
            return await _mediator.Send(cmd as IRequest<TCommand>, token) as Result;
        }
    }
}