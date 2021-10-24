using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class GroupDbStrategy : IDbStrategy<Group>
    {
        public async Task<Result<int>> Delete(IDatabaseInterface db, Group model, CancellationToken token = default)
        {
            return (await (await ApplyToUserGroups(model, ug => db.Delete(ug, token: token)))
                .Bind(users => db.Delete(model, token)));
        }

        public async Task<Result<long>> Insert(IDatabaseInterface db, Group model, CancellationToken token = default)
        {
            return (await (await db.Insert(model, token))
                .TupleBind(_ => 
                {
                    return ApplyToUserGroups(model, ug => 
                    {
                        ug.GroupId = model.Id;
                        return db.Insert(ug, token: token);
                    });
                }))
                .Map((id, _) => id);
        }

        public async Task<Result> LoadReferences(IDatabaseInterface db, Group model, CancellationToken token = default)
        {
            return (await db.LoadReferences(model, token: token))
                .Merge(await model.UserGroups.Select(ug => 
                    db.LoadReferences(ug, token: token)).Aggregate());
        }

        public async Task<Result<int>> Update(IDatabaseInterface db, Group model, CancellationToken token = default)
        {
            return (await (await (await db.LoadSingleById<Group>(model.Id))
                .Bind(async dbGroup =>
                {
                    var listIntersection = model.UserGroups.IncludeExclude(dbGroup.UserGroups);
                    var toDelete = listIntersection.RightExcluded;
                    var toInsert = listIntersection.LeftExcluded;

                    var deleteTask = Task.WhenAll(toDelete.Select(x => db.Delete(x, token)));
                    var insertTask = toInsert.Select(x => db.InsertResult(x, token))
                        .Aggregate();
                    await deleteTask;
                    return await insertTask;
                }))
                .Bind(dbGroup => db.Update(model, token)));
        }

        private async Task<Result<UserGroup[]>> ApplyToUserGroups(Group group,
            Func<UserGroup, Task> fn)
        {
            return await group.UserGroups.Select(async userGroup => 
            {
                await fn(userGroup);
                return Result<UserGroup>.Succeeded(userGroup);
            }).Aggregate();
        }
    }
}