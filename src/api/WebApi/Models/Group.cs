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
    public class Group : CompositeDbModel
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

        public override async Task<Result<DbModel>> Insert(IDatabaseInterface db, 
            CancellationToken token = default)
        {
            return (await (await Insert<Group>(db, token))
                .Bind(group => 
                    ApplyToUserGroups(this, ug => db.Insert(ug, token: token))))
                .Map(_ => this as DbModel);
        }

        public override async Task<Result<DbModel>> Delete(IDatabaseInterface db, CancellationToken token = default)
        {
            return (await (await ApplyToUserGroups(this, ug => db.Delete(ug, token: token)))
                .Bind(users => db.DeleteResult(this, token: token)))
                .Map(_ => this as DbModel);
        }

        public override async Task LoadReferences(IDatabaseInterface db, 
            CancellationToken token = default)
        {
            // bring this back when I figure out multiple active results setting for postgres
            // await Task.WhenAll(UserGroups.Select(ug => 
            //     db.LoadReferencesAsync(ug, token: token)));
            foreach (var ug in UserGroups)
            {
                await db.LoadReferences(ug, token: token);
            }
        }

        private SemaphoreSlim _sem = new SemaphoreSlim(1);
        private async Task<Result<UserGroup[]>> ApplyToUserGroups(DbModel group,
            Func<UserGroup, Task> fn)
        {
            return await UserGroups.Select(async userGroup => 
            {
                await _sem.WaitAsync();
                await fn(userGroup);
                _sem.Release();
                return Result<AppUser>.Succeeded(userGroup);
            }).Aggregate();
        }
    }
}