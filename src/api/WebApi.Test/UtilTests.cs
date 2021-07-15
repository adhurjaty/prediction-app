using Xunit;
using FluentAssertions;
using System.Threading.Tasks;
using Infrastructure;
using System.Collections.Generic;
using System.Linq;
using ServiceStack.OrmLite;
using System;

namespace WebApi.Test
{
    public class UtilTests
    {
        [Fact]
        public void ParseResponseTest()
        {
            string testString = "{\n  \"access_token\": \"ya29.a0AfH6SMAUKV_oXOwy_XYWl1hqwKUfoHnyZZD-ZWOVUNxHucR1p75Ayq0g5MDT5zSjbGw6Iuan6wrKeuhV4ZgF0iG2hVEZ1-Hs7rs2mFT9Vgs_X8wsDaSn_tIciz_NV8BCAFv2zknkvYru18yLjPfgpK26rtgM\",\n  \"expires_in\": 3599,\n  \"scope\": \"openid https://www.googleapis.com/auth/userinfo.email\",\n  \"token_type\": \"Bearer\",\n  \"id_token\": \"eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc3MjA5MTA0Y2NkODkwYTVhZWRkNjczM2UwMjUyZjU0ZTg4MmYxM2MiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0NjY5MTY5ODM1NDQtdDdtNDBiOGhuMDQ3bTl2NWhjYmdyOXEydnQ2aHNhdm0uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NjY5MTY5ODM1NDQtdDdtNDBiOGhuMDQ3bTl2NWhjYmdyOXEydnQ2aHNhdm0uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE5MjQ2MzgxNzcwODI4NjA2MzciLCJlbWFpbCI6ImFkaHVyamF0eUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkNfeWdIUElvamZNUm10MjhOVExXN2ciLCJpYXQiOjE2MjAwOTQzMTAsImV4cCI6MTYyMDA5NzkxMH0.jpvdX9Tm4z9cJq3chdFOcgS1mO1FCPfUgUkeentHBots41rAFemaMYVhHBnxuuafkmyQrbAJ7gjHs0rFfopFiRvjajo5uMKOInql-KBERO3DThILpWjNicA8Bj5mq1xeXUjFlhbElas6EuxSVdSW9gm8RFOh_8j07G0PoKI3aNtTo532cY24VKmj6270hai5WCZCzkeyUAURkJfAvwSWg-TEJykt6M68mFDf-eQ_VnK2JYJw2hJMx17W_Z5Br1taWAwna4ylgVLqUtnBbNYA3Oa1q4imqUD5OuKXpIWNZ1Z87bWQuNwecABLkGHDKFtpyqV0it9jcXfFB2d00jVb6A\"\n}";
            var parsed = testString.FromJson<GoogleOauthResponse>();

            parsed.AccessToken.Should().Be("ya29.a0AfH6SMAUKV_oXOwy_XYWl1hqwKUfoHnyZZD-ZWOVUNxHucR1p75Ayq0g5MDT5zSjbGw6Iuan6wrKeuhV4ZgF0iG2hVEZ1-Hs7rs2mFT9Vgs_X8wsDaSn_tIciz_NV8BCAFv2zknkvYru18yLjPfgpK26rtgM");
        }

        [Fact]
        public async Task BasicDatabaseTests()
        {
            using var fx = new UtilTestFixture()
                .WithUser(new AppUser()
                {
                    DisplayName = "Foo Bar",
                    MainnetAddress = "address",
                    PrestigeAddress = "prestige",
                    PrestigePrivateKey = "key",
                    Email = "foo@bar.baz"
                });

            var user = (await fx.GetUsers()).First(x => x.Email == "foo@bar.baz");

            user.Should().BeEquivalentTo(new AppUser()
                {
                    DisplayName = "Foo Bar",
                    MainnetAddress = "address",
                    PrestigeAddress = "prestige",
                    PrestigePrivateKey = "key",
                    Email = "foo@bar.baz"
                }, config: config => config.Excluding(m => m.Id));
        }

        [Fact]
        public async Task GroupUserRelationDatabaseTest()
        {
            //Given
            var fooUser = new AppUser()
            {
                DisplayName = "Foo Bar",
                MainnetAddress = "address",
                PrestigeAddress = "prestige",
                PrestigePrivateKey = "key",
                Email = "foo@bar.baz"
            };
            var barUser = new AppUser()
            {
                DisplayName = "Bar Baz",
                MainnetAddress = "address",
                PrestigeAddress = "prestige",
                PrestigePrivateKey = "key",
                Email = "foo@bar.com"
            };
            var dbGroup = new Group()
            {
                Name = "test",
                Users = new List<AppUser>() { fooUser, barUser }
            };

            using var fx = new UtilTestFixture()
                .WithUser(fooUser)
                .WithUser(barUser)
                .WithGroup(dbGroup);
            
            //When
            var group = await fx.GetGroup(dbGroup.Id);

            //Then
            group.Users.Should().BeEquivalentTo(new List<AppUser>() { fooUser, barUser });
        }
    }

    internal class UtilTestFixture : BragDbFixture
    {
        public UtilTestFixture WithUser(AppUser user)
        {
            DbUser(user);
            return this;
        }

        public UtilTestFixture WithGroup(Group group)
        {
            DbGroup(group);
            return this;
        }

        public async Task<List<AppUser>> GetUsers()
        {
            return await _db.Select<AppUser>();
        }

        public async Task<Group> GetGroup(Guid id)
        {
            var group = await _db.LoadSingleResultById<Group>(id);
            return group.Success;
        }
    }
}