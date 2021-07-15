using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Infrastructure;

namespace WebApi.Test
{
    public class GroupCommandTests
    {
        [Fact]
        public async Task CreateGroupSuccess()
        {
            //Given
            var user = new AppUser()
            {
                Email = "user@example.com",
                DisplayName = "Anil Test"
            };
            using var fx = new GroupCommandTestFixture();
            fx.WithUser(user);

            //When
            var handler = fx.GetCreateGroupHandler();
            var result = await handler.Handle(new CreateGroupCommand()
            {
                User = user,
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
                Users = new List<AppUser>() { user },
                UserGroups = new List<UserGroup>() 
                {
                    new UserGroup()
                    {
                        GroupId = groupId,
                        User = user
                    }
                }
            });
        }
    }

    internal class GroupCommandTestFixture : BragDbFixture
    {
        public GroupCommandTestFixture WithUser(AppUser user)
        {
            DbUser(user);
            return this;
        }

        public CreateGroupCommandHandler GetCreateGroupHandler()
        {
            return new CreateGroupCommandHandler(_db);
        }

        public async Task<List<Group>> GetGroups()
        {
            return (await _db.SelectResult<Group>()).Success;
        } 
    }
}