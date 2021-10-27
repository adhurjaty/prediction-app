using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class UpdateGroupCommand : AbstractCommand<UpdateGroupCommand>
    {
        public string Email { get; init; }
        public Group Group { get; init; }
    }

    public class UpdateGroupCommandHandler : ICommandHandler<UpdateGroupCommand>
    {
        private readonly IDatabaseInterface _db;
        private readonly IMediatorResult _mediator;

        public UpdateGroupCommandHandler(IDatabaseInterface db, IMediatorResult mediator)
        {
            _db = db;
            _mediator = mediator;
        }

        public async Task<Result> Handle(UpdateGroupCommand cmd)
        {
            if((cmd.Group.Users ?? new List<AppUser>()).Count == 0)
                return Result.Failed("Cannot update group with no users");

            return await (await (await _mediator.Send(new GroupByIdQuery()
                {
                    Email = cmd.Email,
                    GroupId = cmd.Group.Id.ToString()
                }))
                .FailIf(group => 
                    group.Users.FirstOrDefault(x => x.Email == cmd.Email) is null,
                    $"User {cmd.Email} is not in group")
                .Map(_ => cmd.Group.Users.Clique())
                .Bind(userGroups => userGroups.Select(users => _mediator.Send(new AddFriendsCommand()
                    {
                        UserId = users.First().Id.ToString(),
                        FriendIds = users.Skip(1).Select(x => x.Id.ToString()).ToList()
                    }))
                    .Aggregate()))
                .Bind(() => _db.Update(cmd.Group));
        }

        public Task<Result> Handle(UpdateGroupCommand request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}