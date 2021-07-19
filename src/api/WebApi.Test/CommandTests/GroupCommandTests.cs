using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Infrastructure;
using System;

namespace WebApi.Test
{
    public class GroupCommandTests
    {
        private static AppUser SimpleUser = new AppUser()
        {
            Email = "user@example.com",
            DisplayName = "Anil Test"
        };

        [Fact]
        public async Task CreateGroupSuccess()
        {
            //Given
            using var fx = new GroupCommandTestFixture();
            fx.WithUser(SimpleUser);

            //When
            var handler = fx.GetCreateGroupHandler();
            var result = await handler.Handle(new CreateGroupCommand()
            {
                User = SimpleUser,
                Name = "Test Group"
            });

            //Then
            result.IsSuccess.Should().BeTrue();

            var groups = await fx.GetGroups();
            groups.Should().HaveCount(1);
            var group = groups[0];
            var groupId = group.Id;
            group.Should().BeEquivalentTo(new Group()
            {
                Id = groupId,
                Name = "Test Group",
                Users = new List<AppUser>() { SimpleUser },
                UserGroups = new List<UserGroup>() 
                {
                    new UserGroup()
                    {
                        GroupId = groupId,
                        User = SimpleUser
                    }
                }
            });
        }

        [Fact]
        public async Task UpdateGroupSuccess()
        {
            var fooUser = new AppUser()
            {
                DisplayName = "Foo",
                Email = "asdf@me.com"
            };
            var barUser = new AppUser()
            {
                DisplayName = "Bar",
                Email = "fdsa@me.com"
            };
            var bazUser = new AppUser()
            {
                DisplayName = "Baz",
                Email = "jkld@me.com"
            };

            var group = new Group()
            {
                Name = "This Group",
                Users = new List<AppUser>() { fooUser, barUser }
            };

            using var fx = new GroupCommandTestFixture()
                .WithUser(fooUser)
                .WithUser(barUser)
                .WithUser(bazUser)
                .WithGroup(group);
            
            var updatedGroup = new Group()
            {
                Id = group.Id,
                Name = "ThatGroup",
                Users = new List<AppUser>() { barUser, bazUser }
            };

            var handler = fx.GetUpdateGroupHandler();
            var result = await handler.Handle(new UpdateGroupCommand()
            {
                Group = updatedGroup
            });

            result.IsSuccess.Should().BeTrue();
            var dbGroup = await fx.GetGroup(group.Id);
            dbGroup.Name.Should().BeEquivalentTo("ThatGroup");
            dbGroup.Users.Should().BeEquivalentTo(new List<AppUser>() { barUser, bazUser });
        }

        [Theory]
        [MemberData(nameof(EmptyUserData))]
        public async Task UpdateGroupRemoveAllUsersFailure(List<AppUser> users)
        {
            var group = new Group()
            {
                Name = "Test",
                Users = new List<AppUser>() { SimpleUser }
            };

            using var fx = new GroupCommandTestFixture()
                .WithUser(SimpleUser)
                .WithGroup(group);
            
            var handler = fx.GetUpdateGroupHandler();
            var result = await handler.Handle(new UpdateGroupCommand()
            {
                Group = new Group()
                {
                    Id = group.Id,
                    Name = "Test2",
                    Users = users
                }
            });

            result.IsSuccess.Should().BeFalse();
            result.Failure.Should().Be("Cannot update group with no users");
        }

        public static IEnumerable<object[]> EmptyUserData =>
            new List<object[]>()
            {
                new object[]
                {
                    new List<AppUser>()
                },
                new object[]
                {
                    null
                }
            };
    }

    internal class GroupCommandTestFixture : BragDbFixture
    {
        public GroupCommandTestFixture WithUser(AppUser user)
        {
            DbUser(user);
            return this;
        }

        public GroupCommandTestFixture WithGroup(Group group)
        {
            DbGroup(group);
            return this;
        }

        public CreateGroupCommandHandler GetCreateGroupHandler()
        {
            return new CreateGroupCommandHandler(_db);
        }

        public UpdateGroupCommandHandler GetUpdateGroupHandler()
        {
            return new UpdateGroupCommandHandler(_db);
        }

        public async Task<List<Group>> GetGroups()
        {
            return (await _db.SelectResult<Group>()).Success;
        }

        public async Task<Group> GetGroup(Guid groupId)
        {
            return (await _db.LoadSingleResultById<Group>(groupId)).Success;
        }
    }
}