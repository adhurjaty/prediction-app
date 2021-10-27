using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;

namespace WebApi.Test
{
    public class UsersQueryTests
    {
        private static AppUser SingleUser = new AppUser()
        {
            Id = new Guid("153d7e83-3b7b-49a7-a2c6-1d7c3f3d2a7b"),
            Email = "user@example.com",
            DisplayName = "Anil Test"
        };

        private static AppUser OtherUser = new AppUser()
        {
            Id = new Guid("4063ee41-ee40-41a9-9178-dd0b732031e9"),
            Email = "other@example.com",
            DisplayName = "Other Test"
        };

        private static AppUser YetOtherUser = new AppUser()
        {
            Id = new Guid("16f84804-ba6d-4b34-bfb3-ab185ba617a8"),
            Email = "yetother@example.com",
            DisplayName = "Yet Other Test"
        };

        [Fact]
        public async Task GetUserSuccess()
        {
            using var fx = new UsersQueryTestFixture()
                .WithUser(SingleUser);
                
            var handler = fx.GetUserQueryHandler();
            var result = await handler.Handle(new UserQuery()
            {
                Email = SingleUser.Email
            });

            result.IsSuccess.Should().BeTrue();
            result.Success.Should().BeEquivalentTo(SingleUser);
        }

        [Fact]
        public async Task GetEagerUserSuccess()
        {
            SingleUser.Friends = new List<AppUser>()
            {
                OtherUser,
                YetOtherUser
            };

            using var fx = new UsersQueryTestFixture()
                .WithUsers(new List<AppUser>()
                    {
                        OtherUser,
                        YetOtherUser,
                        SingleUser
                    });

            var handler = fx.GetUserEagerQueryHandler();
            var result = await handler.Handle(new UserEagerQuery()
            {
                Email = SingleUser.Email
            });

            result.IsSuccess.Should().BeTrue();
            result.Success.Should().BeEquivalentTo(SingleUser);
            result.Success.Friends.Should().BeEquivalentTo(new List<AppUser>()
            {
                OtherUser,
                YetOtherUser
            });
        }
    }
    
    internal class UsersQueryTestFixture : BragDbFixture
    {
        public UsersQueryTestFixture WithUser(AppUser user)
        {
            DbUser(user);
            return this;
        }

        public UsersQueryTestFixture WithUsers(List<AppUser> users)
        {
            foreach (var user in users)
            {
                DbUser(user);
            }
            return this;
        }


        public UserQueryHandler GetUserQueryHandler()
        {
            return new UserQueryHandler(_db);
        }

        public UserEagerQueryHandler GetUserEagerQueryHandler()
        {
            return new UserEagerQueryHandler(_db);
        }
    }
}