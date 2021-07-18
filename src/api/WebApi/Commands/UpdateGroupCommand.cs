using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class UpdateGroupCommand : AbstractCommand<UpdateGroupCommand>
    {
        public Group Group { get; set; }
    }

    public class UpdateGroupCommandHandler : ICommandHandler<UpdateGroupCommand>
    {
        private readonly IDatabaseInterface _db;

        public UpdateGroupCommandHandler(IDatabaseInterface db)
        {
            _db = db;
        }

        public async Task<Result> Handle(UpdateGroupCommand cmd)
        {
            return await _db.UpdateResult(cmd.Group);
        }

        public Task<Result> Handle(UpdateGroupCommand request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}