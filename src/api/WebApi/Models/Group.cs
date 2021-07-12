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
                    Group = this,
                    User = x
                }).ToList();
            } 
        }

        public override async Task<Result<DbModel>> Insert(IDbConnection db, 
            CancellationToken token = default)
        {
            return (await (await Insert<Group>(db, token))
                .Bind(group => 
                    ApplyToUserGroups(this, ug => db.InsertAsync(ug, token: token))))
                .Map(_ => this as DbModel);
        }

        public override async Task<Result<DbModel>> Delete(IDbConnection db, CancellationToken token = default)
        {
            return (await (await ApplyToUserGroups(this, ug => db.DeleteAsync(ug, token: token)))
                .Bind(users => db.DeleteResult(this, token: token)))
                .Map(_ => this as DbModel);
        }

        private async Task<Result<AppUser[]>> ApplyToUserGroups(DbModel group,
            Func<UserGroup, Task> fn)
        {
            return await Users.Select(async user => 
            {
                var userGroup = new UserGroup()
                {
                    User = user,
                    Group = group as Group
                };
                await fn(userGroup);
                return Result<AppUser>.Succeeded(user);
            }).Aggregate();
        }
    }
}