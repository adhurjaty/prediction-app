using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace WebApi
{
    [Alias("groups")]
    public class Group : DbModel
    {
        public new Guid Id 
        { 
            get => base.Id;
            set
            {
                UserGroups?.ForEach(x => x.GroupId = value);
                base.Id = value;
            }
        }

        public string Name { get; set; }

        [Reference]
        public List<UserGroup> UserGroups { get; set; }

        [Ignore]
        public List<AppUser> Users 
        { 
            get
            {
                return UserGroups?.Select(x => x.User).ToList();
            }
            set
            {
                UserGroups = value?.Select(x => new UserGroup()
                {
                    GroupId = Id,
                    User = x
                }).ToList();
            } 
        }

        [Reference]
        public List<Bet> Bets { get; set; }
        
    }
}