using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Infrastructure;
using System;
using Moq;

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
            fx.WithUser(SimpleUser)
                .WithMediatorResult<UserQuery, AppUser>(Result.Succeeded(SimpleUser));

            //When
            var handler = fx.GetCreateGroupHandler();
            var result = await handler.Handle(new CreateGroupCommand()
            {
                Email = SimpleUser.Email,
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

        private static AppUser FooUser = new AppUser()
        {
            DisplayName = "Foo",
            Email = "asdf@me.com"
        };
        private static AppUser BarUser = new AppUser()
        {
            DisplayName = "Bar",
            Email = "fdsa@me.com"
        };
        private static AppUser BazUser = new AppUser()
        {
            DisplayName = "Baz",
            Email = "jkld@me.com"
        };

        [Fact]
        public async Task UpdateGroupSuccess()
        {
            var group = new Group()
            {
                Name = "This Group",
                Users = new List<AppUser>() { FooUser, BarUser }
            };
            using var fx = new GroupCommandTestFixture()
                .WithUser(FooUser)
                .WithUser(BarUser)
                .WithUser(BazUser)
                .WithGroup(group)
                .WithMediatorResult<AddFriendsCommand>(Result.Succeeded()) 
                .WithMediatorResult<GroupByIdQuery, Group>(Result.Succeeded(group))
                    as GroupCommandTestFixture;
            
            var updatedGroup = new Group()
            {
                Id = group.Id,
                Name = "ThatGroup",
                Users = new List<AppUser>() { BarUser, BazUser }
            };

            var handler = fx.GetUpdateGroupHandler();
            var result = await handler.Handle(new UpdateGroupCommand()
            {
                Email = BarUser.Email,
                Group = updatedGroup
            });

            result.IsSuccess.Should().BeTrue();
            var dbGroup = await fx.GetGroup(group.Id);
            dbGroup.Name.Should().BeEquivalentTo("ThatGroup");
            dbGroup.Users.Should().BeEquivalentTo(new List<AppUser>() { BarUser, BazUser });

            fx.VerifyMediator(new AddFriendsCommand()
            {
                UserId = BarUser.Id.ToString(),
                FriendIds = new List<string>() 
                { 
                    BazUser.Id.ToString() 
                }
            });
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
                .WithGroup(group)
                .WithMediatorResult<AddFriendsCommand>(Result.Succeeded()) 
                    as GroupCommandTestFixture;
            
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

        [Fact]
        public async Task UpdateGroup3CliqueFriends()
        {
            var group = new Group()
            {
                Name = "This Group",
                Users = new List<AppUser>() { FooUser, BarUser }
            };
            using var fx = new GroupCommandTestFixture()
                .WithUser(FooUser)
                .WithUser(BarUser)
                .WithUser(BazUser)
                .WithGroup(group)
                .WithMediatorResult<AddFriendsCommand>(Result.Succeeded()) 
                .WithMediatorResult<GroupByIdQuery, Group>(Result.Succeeded(group))
                    as GroupCommandTestFixture;
            
            var updatedGroup = new Group()
            {
                Id = group.Id,
                Name = "ThatGroup",
                Users = new List<AppUser>() { FooUser, BarUser, BazUser }
            };

            var handler = fx.GetUpdateGroupHandler();
            var result = await handler.Handle(new UpdateGroupCommand()
            {
                Email = FooUser.Email,
                Group = updatedGroup
            });

            fx.VerifyMediator(new AddFriendsCommand()
            {
                UserId = FooUser.Id.ToString(),
                FriendIds = new List<string>() 
                { 
                    BarUser.Id.ToString(),
                    BazUser.Id.ToString() 
                }
            });
            fx.VerifyMediator(new AddFriendsCommand()
            {
                UserId = BarUser.Id.ToString(),
                FriendIds = new List<string>() 
                { 
                    BazUser.Id.ToString() 
                }
            });
            fx.VerifyAddFriendsCallNum(2);
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

        [Fact]
        public async Task DeleteGroupSuccess()
        {
            var group = new Group()
            {
                Name = "Test",
                Users = new List<AppUser>() { SimpleUser }
            };

            using var fx = new GroupCommandTestFixture()
                .WithUser(SimpleUser)
                .WithGroup(group);

            var handler = fx.GetDeleteGroupHandler();
            var result = await handler.Handle(new DeleteGroupCommand()
            {
                Email = SimpleUser.Email,
                GroupId = group.Id.ToString()
            });

            result.IsSuccess.Should().BeTrue();

            var getGroupsHandler = fx.GetGroupsByUserHandler();
            var groups = await getGroupsHandler.Handle(new GroupsByUserQuery()
            {
                Email = SimpleUser.Email
            });

            groups.Success.Should().BeEmpty();
        }

        [Fact]
        public async Task DeleteGroupDoesntExistFailure()
        {
            var group = new Group()
            {
                Name = "Test",
                Users = new List<AppUser>() { SimpleUser }
            };

            using var fx = new GroupCommandTestFixture()
                .WithUser(SimpleUser)
                .WithGroup(group);

            var handler = fx.GetDeleteGroupHandler();
            var result = await handler.Handle(new DeleteGroupCommand()
            {
                GroupId = "c54bb7a4-0390-4743-a81b-3ebce09fbe3f"
            });

            result.IsFailure.Should().BeTrue();
            result.Failure.Should().Be("No matching result");
        }
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
            return new CreateGroupCommandHandler(_db, _mediatorMock.Object);
        }

        public UpdateGroupCommandHandler GetUpdateGroupHandler()
        {
            return new UpdateGroupCommandHandler(_db, _mediatorMock.Object);
        }

        public DeleteGroupCommandHandler GetDeleteGroupHandler()
        {
            return new DeleteGroupCommandHandler(_db);
        }

        public GroupsByUserQueryHandler GetGroupsByUserHandler()
        {
            return new GroupsByUserQueryHandler(_db);
        }

        public async Task<List<Group>> GetGroups()
        {
            return (await _db.Select<Group>()).Success;
        }

        public async Task<Group> GetGroup(Guid groupId)
        {
            return (await _db.LoadSingleById<Group>(groupId)).Success;
        }

        public void VerifyAddFriendsCallNum(int numCalls)
        {
            _mediatorMock.Verify(x => x.Send(It.IsAny<AddFriendsCommand>(), default),
                Times.Exactly(numCalls));
        }
    }
}