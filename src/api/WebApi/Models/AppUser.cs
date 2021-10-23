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
    public class AppUser : CompositeDbModel
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

        // TODO: move these methods to some other class. Breaks SRP
        public override async Task<Result<DbModel>> Delete(IDatabaseInterface db, CancellationToken token = default)
        {
            return (await (await ApplyToFriends(FriendsRelations, 
                    f => db.Delete(f, token: token)))
                .Bind(users => db.DeleteResult(this, token: token)))
                .Map(_ => this as DbModel);
        }

        public override async Task<Result<DbModel>> Insert(IDatabaseInterface db, CancellationToken token = default)
        {
            return (await (await Insert<AppUser>(db, token))
                .Bind(user => ApplyToFriends(FriendsRelations, 
                    f => db.Insert(f, token: token))))
                .Map(_ => this as DbModel);
        }

        public override async Task LoadReferences(IDatabaseInterface db, CancellationToken token = default)
        {
            await db.LoadReferences(this, token: token);
            await Task.WhenAll(FriendsRelations.Select(f => db.LoadReferences(f, token: token)));
        }

        public override async Task<Result<DbModel>> Update(IDatabaseInterface db, 
            CancellationToken token = default)
        {
            return (await (await (await db.LoadSingleResultById<AppUser>(Id))
                .Bind(async dbUser => 
                {
                    var listIntersection = FriendsRelations.IncludeExclude(
                        dbUser.FriendsRelations);
                    var toDelete = listIntersection.RightExcluded;
                    var toInsert = listIntersection.LeftExcluded;

                    var deleteTask = ApplyToFriends(toDelete, x => db.Delete(x, token));
                    var insertTask = ApplyToFriends(toInsert, x => db.InsertResult(x, token));
                    return await (await deleteTask).Bind(_ => insertTask);
                }))
                .Bind(_ => Update<AppUser>(db, token)))
                .Map(_ => this as DbModel);
        }

        private async Task<Result<FriendsRelation[]>> ApplyToFriends(
            List<FriendsRelation> relationships, Func<FriendsRelation, Task> fn)
        {
            return await (relationships ?? new List<FriendsRelation>())
            .Select(async friendsRelation => 
            {
                friendsRelation.UserId = Id;
                var otherRelation = new FriendsRelation()
                {
                    UserId = friendsRelation.Friend.Id,
                    Friend = this
                };
                await Task.WhenAll(fn(friendsRelation), fn(otherRelation));
                return Result<AppUser>.Succeeded(friendsRelation);
            }).Aggregate() ?? Result.Succeeded(new FriendsRelation[] {});
        }
    }
}