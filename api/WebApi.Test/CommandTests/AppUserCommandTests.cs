using Xunit;
using FluentAssertions;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System;
using Infrastructure;

namespace WebApi.Test
{
    public class AppUserCommandTests
    {
        public static AppUser FooUser = new AppUser()
        {
            DisplayName = "Foo",
            Email = "asdf@me.com"
        };
        public static AppUser BarUser = new AppUser()
        {
            DisplayName = "Bar",
            Email = "fdsa@me.com"
        };
        public static AppUser BazUser = new AppUser()
        {
            DisplayName = "Baz",
            Email = "jkld@me.com"
        };


        [Fact]
        public async Task AddMultipleFriendsSuccess()
        {
            using var fx = new AppUserCommandTestFixture()
                .WithUser(FooUser)
                .WithUser(BarUser)
                .WithUser(BazUser);

            var handler = fx.GetAddFriendsHandler();
            var result = await handler.Handle(new AddFriendsCommand()
            {
                UserId = FooUser.Id.ToString(),
                FriendIds = new List<AppUser>() { BarUser, BazUser }
                    .Select(x => x.Id.ToString())
                    .ToList()
            });

            result.IsSuccess.Should().BeTrue();
            var dbUser = await fx.GetUser(FooUser.Id);
            dbUser.Friends.Should().BeEquivalentTo(new AppUser[] { BarUser, BazUser });
        }

        [Fact]
        public async Task AddFriendsWithExistingSuccess()
        {
            using var fx = new AppUserCommandTestFixture()
                .WithUser(FooUser)
                .WithUser(BarUser)
                .WithUser(BazUser);

            var handler = fx.GetAddFriendsHandler();

            var _ = await handler.Handle(new AddFriendsCommand()
            {
                UserId = FooUser.Id.ToString(),
                FriendIds = new List<AppUser>() { BarUser }
                    .Select(x => x.Id.ToString())
                    .ToList()
            });

            var result = await handler.Handle(new AddFriendsCommand()
            {
                UserId = FooUser.Id.ToString(),
                FriendIds = new List<AppUser>() { BarUser, BazUser }
                    .Select(x => x.Id.ToString())
                    .ToList()
            });

            result.IsSuccess.Should().BeTrue();
            var dbUser = await fx.GetUser(FooUser.Id);
            dbUser.Friends.Should().BeEquivalentTo(new AppUser[] { BarUser, BazUser });

            var friendsRelations = await fx.GetFriendsRelations();
            friendsRelations.Should().HaveCount(4);
        }
    }

    internal class AppUserCommandTestFixture : BragDbFixture
    {
        public AppUserCommandTestFixture WithUser(AppUser user)
        {
            DbUser(user);
            return this;
        }

        public AddFriendsCommandHandler GetAddFriendsHandler()
        {
            return new AddFriendsCommandHandler(_db);
        }

        public async Task<AppUser> GetUser(Guid userId)
        {
            return (await _db.LoadSingleById<AppUser>(userId)).Success;
        }

        public async Task<List<FriendsRelation>> GetFriendsRelations()
        {
            return (await _db.Select<FriendsRelation>()).Success;
        }
    }
}