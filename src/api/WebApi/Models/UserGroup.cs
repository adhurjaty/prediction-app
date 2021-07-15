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

        [References(typeof(Group))]
        public Guid GroupId { get; set; }

        [Reference]
        public AppUser User { get; set; }
    }
}