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
                    User = this,
                    Friend = x
                }).ToList();
            }
        }

        public override async Task<Result<DbModel>> Delete(IDatabaseInterface db, CancellationToken token = default)
        {
            return (await (await Delete<AppUser>(db, token))
                .Bind(user =>
                    ApplyToFriends(this, f => db.DeleteAsync(f, token: token))))
                .Map(_ => this as DbModel);
        }

        public override async Task<Result<DbModel>> Insert(IDatabaseInterface db, CancellationToken token = default)
        {
            return (await (await Insert<AppUser>(db, token))
                .Bind(user =>
                    ApplyToFriends(this, f => db.InsertAsync(f, token: token))))
                .Map(_ => this as DbModel);
        }

        public override async Task LoadReferences(IDbConnection db, CancellationToken token = default)
        {
            // bring this back when I figure out multiple active results setting for postgres
            // await Task.WhenAll(UserGroups.Select(ug => 
            //     db.LoadReferencesAsync(ug, token: token)));
            foreach (var friend in FriendsRelations ?? new List<FriendsRelation>())
            {
                await db.LoadReferencesAsync(friend, token: token);
            }
        }

        private SemaphoreSlim _sem = new SemaphoreSlim(1);
        private async Task<Result<FriendsRelation[]>> ApplyToFriends(DbModel group,
            Func<FriendsRelation, Task> fn)
        {
            return await (FriendsRelations ?? new List<FriendsRelation>())
            .Select(async friendsRelation => 
            {
                var otherRelation = new FriendsRelation()
                {
                    User = friendsRelation.Friend,
                    Friend = friendsRelation.User
                };
                await _sem.WaitAsync();
                await fn(friendsRelation);
                await fn(otherRelation);
                _sem.Release();
                return Result<AppUser>.Succeeded(friendsRelation);
            }).Aggregate() ?? Result.Succeeded(new FriendsRelation[] {});
        }
    }
}