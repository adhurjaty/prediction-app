using System;
using ServiceStack.DataAnnotations;

namespace WebApi
{
    [Alias("friends_bridge")]
    public class FriendsRelation
    {
        [References(typeof(AppUser))]
        public Guid UserId { get; set; }

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
        public AppUser Friend { get; set; }

        public override bool Equals(object obj)
        {
            var model = obj as FriendsRelation;
            return model.UserId == UserId && model.FriendId == FriendId;
        }

        public override int GetHashCode()
        {
            return $"{UserId}|{FriendId}".GetHashCode();
        }
    }
}