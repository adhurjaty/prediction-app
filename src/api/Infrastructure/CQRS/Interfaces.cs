using System.Threading.Tasks;

namespace Infrastructure
{
    public interface IQueryHandler<TQuery, TResult> where TQuery : AbstractQuery<TQuery, TResult>
    {
        Task<Result<TResult>> Handle(TQuery query);
    }

    public interface ICommandHandler<TCommand> where TCommand : AbstractCommand<TCommand>
    {
        Task<Result> Handle(TCommand cmd);
    }

    public abstract class AbstractQuery<TQuery, TResult> {}
    public abstract class AbstractCommand<TCommand> {}
}