using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.OrmLite;

namespace WebApi
{
    public class AddFriendsCommand : AbstractCommand<AddFriendsCommand>
    {
        public string UserId { get; set; }
        public List<string> FriendIds { get; set; }
    }

    public class AddFriendsCommandHandler : ICommandHandler<AddFriendsCommand>
    {
        private readonly IDatabaseInterface _db;

        public AddFriendsCommandHandler(IDatabaseInterface db)
        {
            _db = db;
        }

        public async Task<Result> Handle(AddFriendsCommand cmd)
        {
            var userResultTask = _db.LoadSingleResultById<AppUser>(cmd.UserId);
            var friendsResultTask = cmd.FriendIds
                .Select(id => _db.SingleResultById<AppUser>(id))
                .Aggregate();
            return (await userResultTask)
                .TupleBind(_ => friendsResultTask)
                .Tee((user, newFriends) => user.FriendsRelations = newFriends
                    .Select( => ))
                .TupleMap(user => user.Friends.Where(friend => 
                    !Sql.In(friend.Id.ToString(), cmd.FriendIds)))
                .Tee((user, newFriends) => user.Friends.AddRange(newFriends))
        }

        public Task<Result> Handle(AddFriendsCommand request, CancellationToken cancellationToken)
        {
            return Handle(request);
        }
    }
}