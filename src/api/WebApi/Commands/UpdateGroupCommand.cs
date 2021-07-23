using System.Collections.Generic;
using System.Linq;
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
            
            return await (await cmd.Group.Users.Clique()
                .Select(users => _mediator.Send(new AddFriendsCommand()
                {
                    UserId = users.First().Id.ToString(),
                    FriendIds = users.Skip(1).Select(x => x.Id.ToString()).ToList()
                }))
                .Aggregate())
                .Bind(() => _db.UpdateResult(cmd.Group));
        }

        public Task<Result> Handle(UpdateGroupCommand request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }

        private async Task<Result> SetFriends(AppUser user, IEnumerable<AppUser> friends)
        {
            return await friends.Select(friend => _mediator.Send(new AddFriendsCommand()
            {
                UserId = user.Id.ToString(),
                FriendIds = 
            }))
        }
    }
}