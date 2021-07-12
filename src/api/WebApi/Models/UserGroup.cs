using System;
using ServiceStack.DataAnnotations;

namespace WebApi
{
    [Alias("user_group_bridge")]
    public class UserGroup
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

        private Guid _groupId;
        [References(typeof(Group))]
        public Guid GroupId
        { 
            get { return Group?.Id ?? _groupId; }
            set 
            { 
                if(Group != null)
                    Group.Id = value;
                _groupId = value;
            }
        }

        [Reference]
        public AppUser User { get; set; }

        [Reference]
        public Group Group { get; set; }
    }
}