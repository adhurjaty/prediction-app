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
                .WithDeployBetResult(Result.Succeeded())
                .WithTransferTokenResult(Result.Succeeded())
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
            fx.VerifyDeployRequest(cmd.BetId, 2);
            fx.VerifyTransferRequest(cmd.BetId, new List<string>()
            {
                "address1",
                "address2"
            });
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
                .WithDeployBetResult(Result.Failed("Failure"))
                .WithTransferTokenResult(Result.Failed("Failure"))
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

        [Fact]
        // Only run this when the emulator is running
        public async Task Integration_DeployComposerBet()
        {
            using var fx = new BetsCommandTestFixture();
            var sut = await fx.Integration_GetContractsInterface();

            var result = await sut.DeployComposerBet("bet123", 3);
            result.IsSuccess.Should().BeTrue();
        }

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

        public BetsCommandTestFixture WithDeployBetResult(Result result)
        {
            _contractsMock.Setup(x => x.DeployComposerBet(It.IsAny<string>(), It.IsAny<int>()))
                .ReturnsAsync(result);
            return this;
        }

        public BetsCommandTestFixture WithTransferTokenResult(Result result)
        {
            _contractsMock.Setup(x => x.TransferTokens(It.IsAny<string>(),
                It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(result);
            return this;
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

        public void VerifyDeployRequest(string betId, int numMembers)
        {
            _contractsMock.Verify(x => x.DeployComposerBet(betId, numMembers),
                Times.Once());
        }

        public void VerifyTransferRequest(string betId, IEnumerable<string> accountHashes)
        {
            _contractsMock.Verify(x => x.TransferTokens(betId,
                It.Is<IEnumerable<string>>(y => EquivalentObjects(accountHashes, y))),
                Times.Once());
        }
    }
}