using Xunit;
using FluentAssertions;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;

namespace WebApi.Test
{
    public class GroupsByUserQueryTests
    {
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
                            Name = "Foo"
                        },
                        new Group()
                        {
                            Id = new Guid("c6a7c84c-ed27-409a-ae32-fa98dab9f268"),
                            Name = "Bar"
                        },
                        new Group()
                        {
                            Id = new Guid("96f6cdbd-1e3f-472f-a896-ac7b54c28120"),
                            Name = "Baz"
                        }
                    },
                    new AppUser()
                    {
                        Id = new Guid("153d7e83-3b7b-49a7-a2c6-1d7c3f3d2a7b"),
                        Email = "user@example.com",
                        DisplayName = "Anil Test"
                    },
                    new List<UserGroup>()
                    {
                        new UserGroup()
                        {
                            UserId = new Guid("153d7e83-3b7b-49a7-a2c6-1d7c3f3d2a7b"),
                            GroupId = new Guid("fad14765-0a74-42c6-9453-f68414cdac4b")
                        },
                        new UserGroup()
                        {
                            UserId = new Guid("153d7e83-3b7b-49a7-a2c6-1d7c3f3d2a7b"),
                            GroupId = new Guid("c6a7c84c-ed27-409a-ae32-fa98dab9f268")
                        },
                        new UserGroup()
                        {
                            UserId = new Guid("153d7e83-3b7b-49a7-a2c6-1d7c3f3d2a7b"),
                            GroupId = new Guid("96f6cdbd-1e3f-472f-a896-ac7b54c28120")
                        },
                    },
                    new List<Group>()
                    {
                        new Group()
                        {
                            Id = new Guid("fad14765-0a74-42c6-9453-f68414cdac4b"),
                            Name = "Foo"
                        },
                        new Group()
                        {
                            Id = new Guid("c6a7c84c-ed27-409a-ae32-fa98dab9f268"),
                            Name = "Bar"
                        },
                        new Group()
                        {
                            Id = new Guid("96f6cdbd-1e3f-472f-a896-ac7b54c28120"),
                            Name = "Baz"
                        }
                    }
                },
                new object[]
                {
                    new List<Group>(),
                    new AppUser()
                    {
                        Email = "user@example.com",
                        DisplayName = "Anil Test"
                    },
                    new List<UserGroup>(),
                    new List<Group>()
                },
                new object[]
                {
                    new List<Group>()
                    {
                        new Group()
                        {
                            Id = new Guid("fad14765-0a74-42c6-9453-f68414cdac4b"),
                            Name = "Foo"
                        },
                        new Group()
                        {
                            Id = new Guid("c6a7c84c-ed27-409a-ae32-fa98dab9f268"),
                            Name = "Bar"
                        },
                        new Group()
                        {
                            Id = new Guid("96f6cdbd-1e3f-472f-a896-ac7b54c28120"),
                            Name = "Baz"
                        }
                    },
                    new AppUser()
                    {
                        Id = new Guid("153d7e83-3b7b-49a7-a2c6-1d7c3f3d2a7b"),
                        Email = "user@example.com",
                        DisplayName = "Anil Test"
                    },
                    new List<UserGroup>()
                    {
                        new UserGroup()
                        {
                            UserId = new Guid("153d7e83-3b7b-49a7-a2c6-1d7c3f3d2a7b"),
                            GroupId = new Guid("fad14765-0a74-42c6-9453-f68414cdac4b")
                        },
                        new UserGroup()
                        {
                            UserId = new Guid("153d7e83-3b7b-49a7-a2c6-1d7c3f3d2a7b"),
                            GroupId = new Guid("96f6cdbd-1e3f-472f-a896-ac7b54c28120")
                        },
                    },
                    new List<Group>()
                    {
                        new Group()
                        {
                            Id = new Guid("fad14765-0a74-42c6-9453-f68414cdac4b"),
                            Name = "Foo"
                        },
                        new Group()
                        {
                            Id = new Guid("96f6cdbd-1e3f-472f-a896-ac7b54c28120"),
                            Name = "Baz"
                        }
                    }
                },
            };

        [Theory]
        [MemberData(nameof(SuccessGroupsAndUsers))]
        public async Task GetGroupsByUserSucces(List<Group> groups, AppUser user,
            List<UserGroup> bridge, List<Group> expected)
        {
            using var fx = new GroupsByUserTestFixture()
                .WithUser(user)
                .WithBridge(bridge)
                .WithGroups(groups);


            var handler = fx.GetHandler();
            var result = await handler.Handle(new GroupsByUserQuery()
            {
                UserId = user.Id.ToString()
            });

            result.IsSuccess.Should().BeTrue();
            result.Success.Should().BeEquivalentTo(expected);

        }

        
    }

    internal class GroupsByUserTestFixture : BragDbFixture
    {
        public GroupsByUserTestFixture WithUser(AppUser user)
        {
            DbUser(user);
            return this;
        }

        public GroupsByUserTestFixture WithGroup(Group group)
        {
            DbGroup(group);
            return this;
        }

        public GroupsByUserTestFixture WithGroups(List<Group> groups)
        {
            foreach (var group in groups)
            {
                DbGroup(group);
            }
            return this;
        }

        public GroupsByUserTestFixture WithBridge(List<UserGroup> userGroups)
        {
            foreach (var ug in userGroups)
            {
                DbUserGroup(ug);
            }
            return this;
        }

        public GroupsByUserQueryHandler GetHandler()
        {
            return new GroupsByUserQueryHandler(_db);
        }
    }
}