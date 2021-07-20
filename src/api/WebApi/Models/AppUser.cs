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

        public override async Task<Result<DbModel>> Delete(IDatabaseInterface db, CancellationToken token = default)
        {
            return (await (await ApplyToFriends(this, f => db.Delete(f, token: token)))
                .Bind(users => db.DeleteResult(this, token: token)))
                .Map(_ => this as DbModel);
        }

        public override async Task<Result<DbModel>> Insert(IDatabaseInterface db, CancellationToken token = default)
        {
            return (await (await Insert<AppUser>(db, token))
                .Bind(user => ApplyToFriends(this, f => db.Insert(f, token: token))))
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
            throw new NotImplementedException();
        }

        private async Task<Result<FriendsRelation[]>> ApplyToFriends(DbModel group,
            Func<FriendsRelation, Task> fn)
        {
            return await (FriendsRelations ?? new List<FriendsRelation>())
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