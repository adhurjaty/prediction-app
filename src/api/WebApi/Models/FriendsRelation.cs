using System;
using ServiceStack.DataAnnotations;

namespace WebApi
{
    [Alias("friends_bridge")]
    public class FriendsRelation
    {
        private Guid _userId;
        [References(typeof(AppUser))]
        public Guid UserId 
        { 
            get { return User?.Id ?? _userId; }
            set 
            { 
                if(User != null)
                    User.Id = value;
                _userId = value;
            }
        }

        private Guid _friendId;
        [References(typeof(AppUser))]
        public Guid FriendId
        { 
            get { return Friend?.Id ?? _friendId; }
            set 
            { 
                if(Friend != null)
                    Friend.Id = value;
                _friendId = value;
            }
        }

        [Reference]
        public AppUser User { get; set; }

        [Reference]
        public AppUser Friend { get; set; }
    }
}