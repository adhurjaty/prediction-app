using System;
using System.IO;
using Xunit;
using FluentAssertions;
using WebApi;
using System.Threading.Tasks;
using Flow.Net.Sdk;

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

        [Fact]
        public async Task SendBasicTransaction()
        {
            var flow = new FlowInterface(_config);
            var result = await flow.ExecuteTransaction("Cadence/HelloWorld");
            result.Id.FromByteStringToHex().Should().NotBeNull();
        }
    }
}
