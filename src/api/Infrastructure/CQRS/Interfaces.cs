using System.Threading.Tasks;

namespace Infrastructure
{
    public interface IQueryHandler<TQuery, TResult>
    {
        Task<Result<TResult>> Handle(TQuery query);
    }

    public interface ICommandHandler<TCommand>
    {
        Task<Result> Handle(TCommand cmd);
    }
}