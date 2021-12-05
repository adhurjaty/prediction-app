using Xunit;
using FluentAssertions;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using Infrastructure;

namespace WebApi.Test
{
    public class BetsQueryTests
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

        private static Group Group1 = new Group()
        {
            Id = new Guid("fad14765-0a74-42c6-9453-f68414cdac4b"),
            Name = "Foo"
        };

        private static Group Group2 = new Group()
        {
            Id = new Guid("c6a7c84c-ed27-409a-ae32-fa98dab9f268"),
            Name = "Bar"
        };

        private static Group Group3 = new Group()
        {
            Id = new Guid("96f6cdbd-1e3f-472f-a896-ac7b54c28120"),
            Name = "Baz"
        };

        private static Bet Bet1 = new Bet()
        {
            Id = new Guid("0c9213d3-9bbf-4175-9115-7414889e7ac1"),
            Title = "Test bet",
            Description = "test description",
            Address = "123456",
            CloseTime = new DateTime(2022, 11, 25)
        };

        private static Bet Bet2 = new Bet()
        {
            Id = new Guid("0d85354a-bd4b-4264-93a6-30b36c09a801"),
            Title = "Test bet",
            Description = "test description",
            Address = "123456",
            CloseTime = new DateTime(2022, 11, 25)
        };

        private static Bet Bet3 = new Bet()
        {
            Id = new Guid("f5b5c2c1-f6c9-4905-948f-864a02e43d01"),
            Title = "Test bet",
            Description = "test description",
            Address = "123456",
            CloseTime = new DateTime(2022, 11, 25),
        };

        private static Bet Bet4 = new Bet()
        {
            Id = new Guid("d7aebdcd-a84e-4260-b9b0-ec1da73c20d1"),
            Title = "Test bet",
            Description = "test description",
            Address = "123456",
            CloseTime = new DateTime(2022, 11, 25)
        };

        private static Bet Bet5 = new Bet()
        {
            Id = new Guid("3631067c-c47a-4b46-b4e8-d95276dfd8f3"),
            Title = "Test bet",
            Description = "test description",
            Address = "123456",
            CloseTime = new DateTime(2022, 11, 25)
        };

        [Fact]
        public async Task GetBetsByGroupIdSuccess()
        {
            var users = new List<AppUser>() { SingleUser, OtherUser };
            Group1.Users = new List<AppUser>() { SingleUser, OtherUser };
            Group2.Users = new List<AppUser>() { SingleUser };
            Bet1.GroupId = Group1.Id;
            Bet2.GroupId = Group1.Id;
            Bet3.GroupId = Group2.Id;
            Bet4.GroupId = Group2.Id;

            using var fx = new BetsQueryTestFixture()
                .WithUsers(users)
                .WithGroups(new List<Group> { Group1, Group2 })
                .WithBets(new List<Bet> { Bet1, Bet2, Bet3, Bet4 });

            var sut = fx.GetBetsByGroupHandler();
            var result = await sut.Handle(new BetsByGroupQuery()
            {
                GroupId = Group1.Id.ToString()
            });

            result.IsSuccess.Should().BeTrue();
            result.Success.Should().BeEquivalentTo(new List<Bet> { Bet1, Bet2 });
        }
    }

    internal class BetsQueryTestFixture : BragDbFixture
    {
        public BetsQueryTestFixture WithUser(AppUser user)
        {
            DbUser(user);
            return this;
        }

        public BetsQueryTestFixture WithUsers(List<AppUser> users)
        {
            foreach (var user in users)
            {
                DbUser(user);
            }
            return this;
        }

        public BetsQueryTestFixture WithBet(Bet bet)
        {
            DbBet(bet);
            return this;
        }

        public BetsQueryTestFixture WithBets(IEnumerable<Bet> bets)
        {
            foreach(var bet in bets)
                DbBet(bet);
            return this;
        }

        public BetsQueryTestFixture WithGroup(Group group)
        {
            DbGroup(group);
            return this;
        }

        public BetsQueryTestFixture WithGroups(IEnumerable<Group> groups)
        {
            foreach(var group in groups)
                DbGroup(group);
            return this;
        }

        public BetsByGroupQueryHandler GetBetsByGroupHandler()
        {
            return new BetsByGroupQueryHandler(_db);
        }

        public BetsByUserQueryHandler GetBetsByUserHandler()
        {
            return new BetsByUserQueryHandler(_db, _mediatorMock.Object);
        }
    }
}
