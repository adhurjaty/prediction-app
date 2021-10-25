using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;
using System.Linq;

namespace WebApi
{
    [Alias("users")]
    public class AppUser : DbModel
    {
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string PrestigeAddress { get; set; }
        public string MainnetAddress { get; set; }
        [Alias("prestige_privatekey")]
        public string PrestigePrivateKey { get; set; }
        [Reference]
        public List<FriendsRelation> FriendsRelations { get; set; }
        [Ignore]
        public List<AppUser> Friends
        {
            get
            {
                return FriendsRelations?.Select(x => x.Friend).ToList();
            }
            set
            {
                FriendsRelations = value?.Select(x => new FriendsRelation()
                {
                    UserId = Id,
                    Friend = x
                }).ToList();
            }
        }
    }
}