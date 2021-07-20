using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class DeleteGroupCommand : AbstractCommand<DeleteGroupCommand>
    {
        public string GroupId { get; set; }
    }

    public class DeleteGroupCommandHandler : ICommandHandler<DeleteGroupCommand>
    {
        private readonly IDatabaseInterface _db;

        public DeleteGroupCommandHandler(IDatabaseInterface db)
        {
            _db = db;
        }

        public async Task<Result> Handle(DeleteGroupCommand cmd)
        {
            return await (await _db.LoadSingleResultById<Group>(cmd.GroupId))
                .Bind(group => _db.DeleteResult(group)); 
        }

        public Task<Result> Handle(DeleteGroupCommand request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}