using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Flow.Net.Sdk;
using Flow.Net.Sdk.Cadence;
using Flow.Net.Sdk.Client;
using Flow.Net.Sdk.Crypto;
using Flow.Net.Sdk.Models;

namespace WebApi
{
    public class FlowConfig
    {
        public string AccountHash { get; set; }
        public string AccountKey { get; set; }
        public string Host { get; set; }
        public string CadencePath { get; set; }
    }

    public interface IFlow
    {
        Task<FlowSendTransactionResponse> ExecuteTransaction(string scriptName,
            List<ICadence> arguments = default, 
            Dictionary<string, string> addressMap = default, int gasLimit = 0);
    }

    public class FlowInterface : IFlow
    {
        private const int KEY_INDEX = 0;
        private const int DEFAULT_GAS_LIMIT = 10;

        private readonly FlowAddress _delphaiAddress;
        private readonly FlowClientAsync _flowClient;
        private readonly ISigner _signer;
        private readonly string _cadencePath;

        public FlowInterface(FlowConfig config)
        {
            _delphaiAddress = new FlowAddress(config.AccountHash);
            _signer = Flow.Net.Sdk.Crypto.Ecdsa.Utilities.CreateSigner(
                config.AccountKey, SignatureAlgo.ECDSA_P256, HashAlgo.SHA3_256);
            _flowClient = new FlowClientAsync(config.Host);
            _cadencePath = config.CadencePath;
        }

        public async Task<FlowSendTransactionResponse> ExecuteTransaction(
            string scriptName, List<ICadence> arguments=default,
            Dictionary<string, string> addressMap = default, 
            int gasLimit=DEFAULT_GAS_LIMIT)
        {
            var txBody = Utilities.ReadCadenceScript(scriptName, _cadencePath);

            // Get the latest sealed block to use as a reference block
            var latestBlock = await _flowClient.GetLatestBlockHeaderAsync();

            // Get the latest account info for this address
            var delphaiAccount = await _flowClient.GetAccountAtLatestBlockAsync(
                _delphaiAddress);

            // Get the latest sequence number for this key
            var delphaiKey = delphaiAccount.Keys.FirstOrDefault(w => 
                w.Index == KEY_INDEX);
            var sequenceNumber = delphaiKey.SequenceNumber;

            var tx = new FlowTransaction
            {
                Script = txBody,
                GasLimit = (ulong)gasLimit,
                ProposalKey = new FlowProposalKey
                {
                    Address = _delphaiAddress,
                    KeyId = KEY_INDEX,
                    SequenceNumber = sequenceNumber
                },
                Payer = _delphaiAddress,
                ReferenceBlockId = latestBlock.Id,
                Authorizers = new List<FlowAddress>()
                {
                    _delphaiAddress
                },
                Arguments = arguments ?? new List<ICadence>(),
                AddressMap = addressMap
            };
            FlowTransaction.AddEnvelopeSignature(tx, _delphaiAddress, KEY_INDEX,
                _signer);

            return await _flowClient.SendTransactionAsync(tx);
        }
    }
}