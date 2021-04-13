using System;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts;

namespace WebApi
{
    public class EqualAntePropositionDeploy : ContractDeploymentMessage
    {
        public static string ByteCode;

        [Parameter("string", "_title")]
        public string Title { get; set; }

        [Parameter("uint", "_resolution_time")]
        public UInt64 ResolutionTime { get; set; }

        [Parameter("uint", "_bet_closing_time")]
        public UInt64 BetClosingTime { get; set; }

        public EqualAntePropositionDeploy() : base(ByteCode) 
        {
            if(string.IsNullOrEmpty(ByteCode))
                throw new Exception("Must assign ByteCode to contract");
        }
    }
}