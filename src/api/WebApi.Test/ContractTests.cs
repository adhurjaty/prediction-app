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

namespace WebApi.Test
{
    public class ContractTests
    {
        private static string OBJECTS_PATH = @"Objects";
        private static FlowConfig _config = new FlowConfig()
        {
            AccountHash = "f8d6e0586b0a20c7",
            AccountKey = "06272ec1c8367f040e3cfa7d9b11cb81bc6c0e77cf774777e5573dc4b8566aaa",
            Host = "127.0.0.1:3569",
            CadencePath = OBJECTS_PATH
        };

        // [Fact]
        // public async Task SendBasicTransaction()
        // {
        //     var flow = new FlowInterface(_config);
        //     var result = await flow.ExecuteTransaction("Cadence/HelloWorld");
        //     result.Id.FromByteStringToHex().Should().NotBeNull();
        // }

        [Fact]
        public async Task TransferTokensSuccess()
        {
            var fx = new ContractTestFixture()
                .WithTransactionResponse("transferTokens",
                    new FlowSendTransactionResponse()
                    {
                        Id = "blah".FromStringToByteString()
                    })
                .WithDelphaiAddress("delphai");

            var sut = fx.GetContractsInterface();
            var result = await sut.TransferTokens("betId1234", new string[]
            {
                "user1",
                "user2",
                "user3"
            });

            result.IsSuccess.Should().BeTrue();
            fx.VerifyTransactionRequest("transferTokens",
                new List<ICadence>()
                {
                    new CadenceString("betId1234"),
                    new CadenceArray(new List<ICadence>()
                    {
                        new CadenceAddress("user1"),
                        new CadenceAddress("user2"),
                        new CadenceAddress("user3"),
                    })
                },
                new Dictionary<string, string>()
                {
                    { "Delphai", "delphai" }
                });
        }
    }

    internal class ContractTestFixture : BragDbFixture
    {
        private readonly Mock<IFlow> _flowMock = new();
        private string _delphaiAddress;

        public ContractTestFixture WithTransactionResponse(string scriptName,
            FlowSendTransactionResponse response)
        {
            _flowMock.Setup(x => x.ExecuteTransaction(scriptName,
                It.IsAny<List<ICadence>>(), It.IsAny<Dictionary<string, string>>(),
                It.IsAny<int>()))
                .ReturnsAsync(response);
            return this;
        }

        public ContractTestFixture WithDelphaiAddress(string address)
        {
            _delphaiAddress = address;
            return this;
        }

        public ContractsInterface GetContractsInterface()
        {
            return new ContractsInterface(_flowMock.Object, _delphaiAddress);
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
