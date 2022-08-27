using System;
using System.IO;
using Xunit;
using FluentAssertions;
using WebApi;
using System.Threading.Tasks;
using Flow.Net.Sdk;
using Flow.Net.Sdk.Models;
using Moq;
using System.Collections.Generic;
using Flow.Net.Sdk.Cadence;
using Flow.Net.Sdk.Exceptions;

namespace WebApi.Test
{
    public class ContractTests
    {
        private static string OBJECTS_PATH = @"Objects";
        private static FlowConfig _config = new FlowConfig()
        {
            Host = "127.0.0.1:3569",
            CadencePath = OBJECTS_PATH,
            AccountName = "delphai"
        };

        // [Fact]
        // public async Task SendBasicTransaction()
        // {
        //     var flow = new FlowInterface(_config);
        //     var result = await flow.ExecuteTransaction("Cadence/HelloWorld");
        //     result.Id.FromByteStringToHex().Should().NotBeNull();
        // }

        [Fact]
        public async Task CreateYesNoBetSuccess() 
        {
            using var fx = new ContractTestFixture()
                .WithTransactionResponse("createYesNoBetFUSD",
                    new FlowTransactionResult()
                    {
                        Status = new Flow.Net.Sdk.Protos.entities.TransactionStatus()
                    })
                .WithDelphaiAddress("delphai");

            var sut = fx.GetContractsInterface();
            var result = await sut.CreateYesNoBet("betId1234");

            result.IsSuccess.Should().BeTrue();
            fx.VerifyTransactionRequest("createYesNoBetFUSD",
                new List<ICadence>()
                {
                    new CadenceString("betId1234"),
                },
                new Dictionary<string, string>()
                {
                    { "delphai", "delphai" },
                    { "FUSD", "delphai" }
                });
        }

        [Fact]
        public async Task CreateYesNoResolverSuccess() 
        {
            using var fx = new ContractTestFixture()
                .WithTransactionResponse("createYesNoResolver",
                    new FlowTransactionResult()
                    {
                        Status = new Flow.Net.Sdk.Protos.entities.TransactionStatus()
                    })
                .WithDelphaiAddress("delphai");

            var sut = fx.GetContractsInterface();
            var result = await sut.CreateYesNoResolver("betId1234", 4);

            result.IsSuccess.Should().BeTrue();
            fx.VerifyTransactionRequest("createYesNoResolver",
                new List<ICadence>()
                {
                    new CadenceString("betId1234"),
                    new CadenceNumber(CadenceNumberType.Int, "4")
                },
                new Dictionary<string, string>()
                {
                    { "delphai", "delphai" },
                });
        }

        [Fact]
        public async Task CreateWinLosePayoutSuccess() 
        {
            using var fx = new ContractTestFixture()
                .WithTransactionResponse("createWinLosePayoutFUSD",
                    new FlowTransactionResult()
                    {
                        Status = new Flow.Net.Sdk.Protos.entities.TransactionStatus()
                    })
                .WithDelphaiAddress("delphai");

            var sut = fx.GetContractsInterface();
            var result = await sut.CreateYesNoBet("betId1234");

            result.IsSuccess.Should().BeTrue();
            fx.VerifyTransactionRequest("createWinLosePayoutFUSD",
                new List<ICadence>()
                {
                    new CadenceString("betId1234"),
                },
                new Dictionary<string, string>()
                {
                    { "delphai", "delphai" },
                    { "FUSD", "delphai" }
                });
        }

        [Fact]
        public async Task CreateAllBetsCloserSuccess() 
        {
            using var fx = new ContractTestFixture()
                .WithTransactionResponse("createAllBetsCloser",
                    new FlowTransactionResult()
                    {
                        Status = new Flow.Net.Sdk.Protos.entities.TransactionStatus()
                    })
                .WithDelphaiAddress("delphai");

            var sut = fx.GetContractsInterface();
            var result = await sut.CreateAllBetsCloser("betId1234", 4);

            result.IsSuccess.Should().BeTrue();
            fx.VerifyTransactionRequest("createAllBetsCloser",
                new List<ICadence>()
                {
                    new CadenceString("betId1234"),
                    new CadenceNumber(CadenceNumberType.Int, "4")
                },
                new Dictionary<string, string>()
                {
                    { "delphai", "delphai" },
                });
        }

        [Fact]
        public async Task CreateComposerSuccess()
        {
            using var fx = new ContractTestFixture()
                .WithTransactionResponse("createComposer",
                    new FlowTransactionResult()
                    {
                        Status = new Flow.Net.Sdk.Protos.entities.TransactionStatus()
                    })
                .WithDelphaiAddress("delphai");

            var sut = fx.GetContractsInterface();
            var result = await sut.CreateComposer("betId1234");

            result.IsSuccess.Should().BeTrue();
            fx.VerifyTransactionRequest("createComposer",
                new List<ICadence>()
                {
                    new CadenceString("betId1234"),
                },
                new Dictionary<string, string>()
                {
                    { "delphai", "delphai" }
                });
        }
    }

    internal class ContractTestFixture : BragDbFixture
    {
        private readonly Mock<IFlow> _flowMock = new();
        private string _delphaiAddress;

        public ContractTestFixture WithTransactionResponse(string scriptName,
            FlowTransactionResult response)
        {
            _flowMock.Setup(x => x.ExecuteTransaction(scriptName,
                It.IsAny<List<ICadence>>(), It.IsAny<Dictionary<string, string>>(),
                It.IsAny<int>()))
                .ReturnsAsync(response);
            return this;
        }

        public ContractTestFixture WithTransactionException(string scriptName,
            FlowException ex)
        {
            _flowMock.Setup(x => x.ExecuteTransaction(scriptName,
                It.IsAny<List<ICadence>>(), It.IsAny<Dictionary<string, string>>(),
                It.IsAny<int>()))
                .ThrowsAsync(ex);
            return this;
        }


        public ContractTestFixture WithDelphaiAddress(string address)
        {
            _delphaiAddress = address;
            return this;
        }

        public ContractsInterface GetContractsInterface()
        {
            return new ContractsInterface(_flowMock.Object, _delphaiAddress,
                new Dictionary<string, string>());
        }

        public void VerifyTransactionRequest(string scriptName, List<ICadence> arguments,
            Dictionary<string, string> addressMap)
        {
            _flowMock.Verify(x => x.ExecuteTransaction(scriptName,
                It.Is<List<ICadence>>(y => EquivalentObjects(arguments, y)),
                It.Is<Dictionary<string, string>>(y => EquivalentObjects(addressMap, y)),
                It.IsAny<int>()), Times.Once());
        }
    }
}
