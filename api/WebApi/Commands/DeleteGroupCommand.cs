using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class DeleteGroupCommand : AbstractCommand<DeleteGroupCommand>
    {
        public AppUser User { get; init; }
        public string GroupId { get; init; }
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

            return await (await _db.LoadSingleById<Group>(cmd.GroupId))
                .FailIf(group => 
                    group.Users.FirstOrDefault(x => x.Id == cmd.User.Id) is null,
                    $"User {cmd.User.Email} is not in group")
                .Bind(group => _db.Delete(group)); 
        }

        public Task<Result> Handle(DeleteGroupCommand request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}