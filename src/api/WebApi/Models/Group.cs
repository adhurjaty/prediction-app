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
                    GroupId = Id,
                    User = x
                }).ToList();
            } 
        }

        public override async Task<Result<DbModel>> Insert(IDatabaseInterface db, 
            CancellationToken token = default)
        {
            return (await (await Insert<Group>(db, token))
                .Bind(group => 
                {
                    return ApplyToUserGroups(this, ug => 
                    {
                        ug.GroupId = Id;
                        return db.Insert(ug, token: token);
                    });
                }))
                .Map(_ => this as DbModel);
        }

        public override async Task<Result<DbModel>> Delete(IDatabaseInterface db, CancellationToken token = default)
        {
            return (await (await ApplyToUserGroups(this, ug => db.Delete(ug, token: token)))
                .Bind(users => Delete<Group>(db, token)))
                .Map(_ => this as DbModel);
        }

        public override async Task LoadReferences(IDatabaseInterface db, 
            CancellationToken token = default)
        {
            await db.LoadReferences(this, token: token);
            await Task.WhenAll(UserGroups.Select(ug => 
                db.LoadReferences(ug, token: token)));
        }

        public override async Task<Result<DbModel>> Update(IDatabaseInterface db, 
            CancellationToken token = default)
        {
            return (await (await (await db.LoadSingleResultById<Group>(Id))
                .Bind(async dbGroup => 
                {
                    var listIntersection = UserGroups.IncludeExclude(dbGroup.UserGroups);
                    var toDelete = listIntersection.RightExcluded;
                    var toInsert = listIntersection.LeftExcluded;

                    var deleteTask = Task.WhenAll(toDelete.Select(x => db.Delete(x, token)));
                    var insertTask = toInsert.Select(x => db.InsertResult(x, token))
                        .Aggregate();
                    await deleteTask;
                    return await insertTask;
                }))
                .Bind(dbGroup => Update<Group>(db, token)))
                .Map(_ => this as DbModel);
        }

        private async Task<Result<UserGroup[]>> ApplyToUserGroups(DbModel group,
            Func<UserGroup, Task> fn)
        {
            return await UserGroups.Select(async userGroup => 
            {
                await fn(userGroup);
                return Result<UserGroup>.Succeeded(userGroup);
            }).Aggregate();
        }
    }
}