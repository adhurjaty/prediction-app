using System.Collections.Generic;
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
            if((cmd.Group.Users ?? new List<AppUser>()).Count == 0)
                return Result.Failed("Cannot update group with no users");
            return await _db.UpdateResult(cmd.Group);
        }

        public Task<Result> Handle(UpdateGroupCommand request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}