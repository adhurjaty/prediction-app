using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi
{
    public class AppUserDbStrategy : DefaultModelDbStrategy<AppUser>
    {
        public override async Task<Result<int>> Delete(IDatabaseInterface db, AppUser model, CancellationToken token = default)
        {
            return await (await ApplyToFriends(model, model.FriendsRelations,
                    f => db.Delete(f, token: token)))
                .Bind(users => db.Delete(model, token: token));
        }

        public override async Task<Result<long>> Insert(IDatabaseInterface db, AppUser model, CancellationToken token = default)
        {
            return await (await base.Insert(db, model, token))
                .Bind(async id =>
                {
                    return (await ApplyToFriends(model, model.FriendsRelations,
                                f => db.Insert(f, token: token)))
                            .Map(_ => id);
                });
        }

        public override async Task<Result> LoadReferences(IDatabaseInterface db, AppUser model, CancellationToken token = default)
        {
            return (await db.LoadReferences(model, token: token))
                .Merge(await model.FriendsRelations
                    .Select(f => db.LoadReferences(f, token: token))
                    .Aggregate());
        }

        public override async Task<Result<int>> Update(IDatabaseInterface db, AppUser model, CancellationToken token = default)
        {
            return (await (await (await db.LoadSingleById<AppUser>(model.Id))
                .Bind(async dbUser =>
                {
                    var listIntersection = model.FriendsRelations.IncludeExclude(
                        dbUser.FriendsRelations);
                    var toDelete = listIntersection.RightExcluded;
                    var toInsert = listIntersection.LeftExcluded;

                    var deleteTask = ApplyToFriends(model, toDelete, x => db.Delete(x, token));
                    var insertTask = ApplyToFriends(model, toInsert, x => db.InsertResult(x, token));
                    return await (await deleteTask).Bind(_ => insertTask);
                }))
                .Bind(_ => db.Update(model, token)));
        }

        private async Task<Result<FriendsRelation[]>> ApplyToFriends(AppUser user,
            List<FriendsRelation> relationships, Func<FriendsRelation, Task> fn)
        {
            return await (relationships ?? new List<FriendsRelation>())
                .Select(async friendsRelation => 
                {
                    friendsRelation.UserId = user.Id;
                    var otherRelation = new FriendsRelation()
                    {
                        UserId = friendsRelation.FriendId,
                        Friend = user
                    };
                    await Task.WhenAll(fn(friendsRelation), fn(otherRelation));
                    return Result<AppUser>.Succeeded(friendsRelation);
                }).Aggregate() ?? Result.Succeeded(new FriendsRelation[] {});
        }
    }
}