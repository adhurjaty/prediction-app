using Xunit;
using FluentAssertions;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;

namespace WebApi.Test
{
    public class GroupsQueryTests
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

        public static IEnumerable<object[]> SuccessGroupsAndUsers =>
            new List<object[]>()
            {
                new object[]
                {
                    new List<Group>()
                    {
                        new Group()
                        {
                            Id = new Guid("fad14765-0a74-42c6-9453-f68414cdac4b"),
                            Name = "Foo",
                            Users = new List<AppUser>() { SingleUser }
                        },
                        new Group()
                        {
                            Id = new Guid("c6a7c84c-ed27-409a-ae32-fa98dab9f268"),
                            Name = "Bar",
                            Users = new List<AppUser>() { SingleUser }
                        },
                        new Group()
                        {
                            Id = new Guid("96f6cdbd-1e3f-472f-a896-ac7b54c28120"),
                            Name = "Baz",
                            Users = new List<AppUser>() { SingleUser }
                        }
                    },
                    SingleUser,
                    new List<AppUser>() { SingleUser },
                    new List<Group>()
                    {
                        new Group()
                        {
                            Id = new Guid("fad14765-0a74-42c6-9453-f68414cdac4b"),
                            Name = "Foo",
                            Users = new List<AppUser>() { SingleUser }
                        },
                        new Group()
                        {
                            Id = new Guid("c6a7c84c-ed27-409a-ae32-fa98dab9f268"),
                            Name = "Bar",
                            Users = new List<AppUser>() { SingleUser }
                        },
                        new Group()
                        {
                            Id = new Guid("96f6cdbd-1e3f-472f-a896-ac7b54c28120"),
                            Name = "Baz",
                            Users = new List<AppUser>() { SingleUser }
                        }
                    }
                },
                new object[]
                {
                    new List<Group>(),
                    SingleUser,
                    new List<AppUser>() { SingleUser },
                    new List<Group>()
                },
                new object[]
                {
                    new List<Group>()
                    {
                        new Group()
                        {
                            Id = new Guid("fad14765-0a74-42c6-9453-f68414cdac4b"),
                            Name = "Foo",
                            Users = new List<AppUser>() { SingleUser }
                        },
                        new Group()
                        {
                            Id = new Guid("c6a7c84c-ed27-409a-ae32-fa98dab9f268"),
                            Name = "Bar",
                            Users = new List<AppUser>() { OtherUser }
                        },
                        new Group()
                        {
                            Id = new Guid("96f6cdbd-1e3f-472f-a896-ac7b54c28120"),
                            Name = "Baz",
                            Users = new List<AppUser>() { SingleUser, OtherUser }
                        }
                    },
                    SingleUser,
                    new List<AppUser>() { SingleUser, OtherUser },
                    new List<Group>()
                    {
                        new Group()
                        {
                            Id = new Guid("fad14765-0a74-42c6-9453-f68414cdac4b"),
                            Name = "Foo",
                            Users = new List<AppUser>() { SingleUser }
                        },
                        new Group()
                        {
                            Id = new Guid("96f6cdbd-1e3f-472f-a896-ac7b54c28120"),
                            Name = "Baz",
                            Users = new List<AppUser>() { SingleUser, OtherUser }
                        }
                    }
                },
            };

        [Theory]
        [MemberData(nameof(SuccessGroupsAndUsers))]
        public async Task GetGroupsByUserSucces(List<Group> groups, AppUser user,
            List<AppUser> users, List<Group> expected)
        {
            using var fx = new GroupsQueryTestFixture()
                .WithUsers(users)
                .WithGroups(groups);

            var handler = fx.GetGroupsByUserHandler();
            var result = await handler.Handle(new GroupsByUserQuery()
            {
                UserId = user.Id.ToString()
            });

            result.IsSuccess.Should().BeTrue();
            result.Success.Should().BeEquivalentTo(expected);
        }

        [Fact]
        public async Task GetGroupByGroupIdSuccess()
        {
            var group = new Group()
            {
                Name = "Test Group",
                Users = new List<AppUser>() { SingleUser }
            };
            using var fx = new GroupsQueryTestFixture()
                .WithUser(SingleUser)
                .WithGroup(group);

            var handler = fx.GetGroupByIdHandler();
            var result = await handler.Handle(new GroupByIdQuery()
            {
                UserId = SingleUser.Id,
                GroupId = group.Id.ToString()
            });

            result.IsSuccess.Should().BeTrue();
            result.Success.Should().BeEquivalentTo(new Group()
            {
                Id = group.Id,
                Name = "Test Group",
                Users = new List<AppUser>() { SingleUser },
                UserGroups = new List<UserGroup>()
                {
                    new UserGroup()
                    {
                        User = SingleUser,
                        GroupId = group.Id
                    }
                }
            });
        }

        [Fact]
        public async Task GetGroupByGroupIdWrongUser()
        {
            var group = new Group()
            {
                Name = "Test Group",
                Users = new List<AppUser>() { SingleUser }
            };
            using var fx = new GroupsQueryTestFixture()
                .WithUser(SingleUser)
                .WithUser(OtherUser)
                .WithGroup(group);

            var handler = fx.GetGroupByIdHandler();
            var result = await handler.Handle(new GroupByIdQuery()
            {
                UserId = OtherUser.Id,
                GroupId = group.Id.ToString()
            });

            result.IsSuccess.Should().BeFalse();
            result.Failure.Should().BeEquivalentTo($"User {OtherUser.Id} is not in group");
        }
    }

    internal class GroupsQueryTestFixture : BragDbFixture
    {
        public GroupsQueryTestFixture WithUser(AppUser user)
        {
            DbUser(user);
            return this;
        }

        public GroupsQueryTestFixture WithUsers(List<AppUser> users)
        {
            foreach (var user in users)
            {
                DbUser(user);
            }
            return this;
        }

        public GroupsQueryTestFixture WithGroup(Group group)
        {
            DbGroup(group);
            return this;
        }

        public GroupsQueryTestFixture WithGroups(List<Group> groups)
        {
            foreach (var group in groups)
            {
                DbGroup(group);
            }
            return this;
        }

        public GroupsByUserQueryHandler GetGroupsByUserHandler()
        {
            return new GroupsByUserQueryHandler(_db);
        }

        public GroupByIdQueryHandler GetGroupByIdHandler()
        {
            return new GroupByIdQueryHandler(_db);
        }
    }
}