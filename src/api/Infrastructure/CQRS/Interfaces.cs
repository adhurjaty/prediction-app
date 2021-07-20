using System.Threading.Tasks;
using MediatR;

namespace Infrastructure
{
    public interface IQueryHandler<TQuery, TResult> : IRequestHandler<TQuery, Result<TResult>>
        where TQuery : AbstractQuery<TQuery, TResult>
    {
        Task<Result<TResult>> Handle(TQuery query);
    }

    public interface ICommandHandler<TCommand> : IRequestHandler<TCommand, Result> 
        where TCommand : AbstractCommand<TCommand>
    {
        Task<Result> Handle(TCommand cmd);
    }

    public abstract class AbstractQuery<TQuery, TResult> : IRequest<Result<TResult>>
    {
        public AbstractQuery() {}
    }

    public abstract class AbstractCommand<TCommand> : IRequest<Result>
    {
        public AbstractCommand() {}
    }
}