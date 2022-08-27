using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Flow.Net.Sdk.Cadence;
using FluentAssertions;
using Infrastructure;
using Moq;
using Xunit;

namespace WebApi.Test
{
    public class BetsCommandTests
    {
        private static AppUser SingleUser = new AppUser()
        {
            Id = new Guid("153d7e83-3b7b-49a7-a2c6-1d7c3f3d2a7b"),
            Email = "user@example.com",
            DisplayName = "Anil Test",
            MainnetAddress = "address1"
        };

        private static AppUser OtherUser = new AppUser()
        {
            Id = new Guid("4063ee41-ee40-41a9-9178-dd0b732031e9"),
            Email = "other@example.com",
            DisplayName = "Other Test",
            MainnetAddress = "address2"
        };

        private static AppUser FooUser = new AppUser()
        {
            Id = new Guid("4063ee41-ee40-41a9-9178-dd0b732031e9"),
            Email = "foo@bar.baz",
        };

        [Fact]
        public async Task CreateBetSuccess()
        {
            var group = new Group()
            {
                Name = "SoothSayans",
                Users = new List<AppUser>()
                {
                    SingleUser,
                    OtherUser
                }
            };
            using var fx = (new BetsCommandTestFixture()
                .WithUsers(new List<AppUser>() { SingleUser, OtherUser })
                .WithGroup(group) as BetsCommandTestFixture)
                .WithCreateAllResourcesResult(Result.Succeeded())
                .WithMediatorResult<GroupByIdQuery, Group>(Result.Succeeded(group)) 
                    as BetsCommandTestFixture;

            var sut = fx.GetCreateCommandHandler();
            var cmd = new CreateBetCommand()
            {
                Title = "FooBet",
                Description = "This is a bet",
                GroupId = group.Id.ToString(),
                User = FooUser
            };
            var result = await sut.Handle(cmd);

            result.IsSuccess.Should().BeTrue();
            cmd.BetId.Should().NotBeNullOrEmpty();
            (await fx.GetModel<Bet>(cmd.BetId.ToString()))
                .Tee(dbBet => dbBet.Should().NotBeNull())
                .IsSuccess.Should().BeTrue();
            fx.VerifyMediator<GroupByIdQuery, Group>(new GroupByIdQuery()
            {
                User = FooUser,
                GroupId = group.Id.ToString()
            });
            fx.VerifyCreateBetCall(cmd.BetId);
            fx.VerifyCreateCloserCall(cmd.BetId, 2);
            fx.VerifyCreateComposerCall(cmd.BetId);
            fx.VerifyCreatePayoutCall(cmd.BetId);
            fx.VerifyCreateResolverCall(cmd.BetId, 2);
        }

        [Fact]
        public async Task CreateBetFailureRollback()
        {
            var group = new Group()
            {
                Name = "SoothSayans",
                Users = new List<AppUser>()
                {
                    SingleUser,
                    OtherUser
                }
            };
            using var fx = (new BetsCommandTestFixture()
                .WithUsers(new List<AppUser>() { SingleUser, OtherUser })
                .WithGroup(group) as BetsCommandTestFixture)
                .WithCreateAllResourcesResult(Result.Failed("Failure"))
                .WithMediatorResult<GroupByIdQuery, Group>(Result.Succeeded(group)) 
                    as BetsCommandTestFixture;

            var sut = fx.GetCreateCommandHandler();
            var cmd = new CreateBetCommand()
            {
                Title = "FooBet",
                Description = "This is a bet",
                GroupId = group.Id.ToString(),
                User = FooUser
            };
            var result = await sut.Handle(cmd);

            result.IsSuccess.Should().BeFalse();
            result.Failure.Should().Be("Could not deploy contract to blockchain");

            (await fx.GetModel<Bet>(cmd.BetId.ToString())).IsSuccess.Should().BeFalse();
        }

        // [Fact]
        // Only run this when the emulator is running
        // public async Task Integration_DeployComposerBet()
        // {
        //     using var fx = new BetsCommandTestFixture();
        //     var sut = await fx.Integration_GetContractsInterface();

        //     var result = await sut.DeployComposerBet("bet123", 3);
        //     result.IsSuccess.Should().BeTrue();
        // }

        [Fact]
        public async Task Integration_ExecuteTransaction()
        {
            using var fx = new BetsCommandTestFixture();
            var sut = await fx.Integration_GetFlowInterface();

            var addressMap = new Dictionary<string, string>()
            {
                { "delphai", "f8d6e0586b0a20c7" }
            };

            var result = await sut.ExecuteTransaction("log-signer-address",
                addressMap: addressMap);
            result.ErrorMessage.Should().BeNull();
        }
    }

    internal class BetsCommandTestFixture : BetsQueryTestFixture
    {
        private readonly Mock<IContracts> _contractsMock = new();

        public BetsCommandTestFixture WithCreateComposerResult(Result result)
        {
            _contractsMock.Setup(x => x.CreateComposer(It.IsAny<string>()))
                .ReturnsAsync(result);
            return this;
        }

        public BetsCommandTestFixture WithCreateBetResult(Result result)
        {
            _contractsMock.Setup(x => x.CreateYesNoBet(It.IsAny<string>()))
                .ReturnsAsync(result);
            return this;
        }

        public BetsCommandTestFixture WithCreateResolverResult(Result result)
        {
            _contractsMock.Setup(x => x.CreateYesNoResolver(It.IsAny<string>(),
                It.IsAny<int>())).ReturnsAsync(result);
            return this;
        }

        public BetsCommandTestFixture WithCreatePayoutResult(Result result)
        {
            _contractsMock.Setup(x => x.CreateWinLosePayout(It.IsAny<string>()))
                .ReturnsAsync(result);
            return this;
        }

        public BetsCommandTestFixture WithCreateCloserResult(Result result)
        {
            _contractsMock.Setup(x => x.CreateAllBetsCloser(It.IsAny<string>(),
                It.IsAny<int>())).ReturnsAsync(result);
            return this;
        }

        public BetsCommandTestFixture WithCreateAllResourcesResult(Result result)
        {
            return WithCreatePayoutResult(result)
                .WithCreateResolverResult(result)
                .WithCreateBetResult(result)
                .WithCreatePayoutResult(result)
                .WithCreateComposerResult(result);
        }

        public CreateBetCommandHandler GetCreateCommandHandler()
        {
            return new CreateBetCommandHandler(_db, _mediatorMock.Object, _contractsMock.Object);
        }

        public async Task<ContractsInterface> Integration_GetContractsInterface()
        {
            var config = new FlowConfig()
            {
                Host = "127.0.0.1:3569",
                CadencePath = "./Contract/Cadence",
                AccountName = "delphai"
            };

            return await ContractsInterface.CreateInstance(config);
        }

        public async Task<FlowInterface> Integration_GetFlowInterface()
        {
            var config = new FlowConfig()
            {
                Host = "127.0.0.1:3569",
                CadencePath = "./Contract/Cadence",
                AccountName = "delphai"
            };

            return await FlowInterface.CreateInstance(config);
        }

        public void VerifyCreateComposerCall(string betId)
        {
            _contractsMock.Verify(x => x.CreateComposer(betId), Times.Once());
        }

        public void VerifyCreateBetCall(string betId)
        {
            _contractsMock.Verify(x => x.CreateYesNoBet(betId), Times.Once());
        }

        public void VerifyCreateResolverCall(string betId, int num)
        {
            _contractsMock.Verify(x => x.CreateYesNoResolver(betId, num), Times.Once());
        }

        public void VerifyCreatePayoutCall(string betId)
        {
            _contractsMock.Verify(x => x.CreateWinLosePayout(betId), Times.Once());
        }

        public void VerifyCreateCloserCall(string betId, int num)
        {
            _contractsMock.Verify(x => x.CreateAllBetsCloser(betId, num), Times.Once());
        }
    }
}