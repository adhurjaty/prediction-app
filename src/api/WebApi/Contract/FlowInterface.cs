using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Flow.Net.Sdk;
using Flow.Net.Sdk.Cadence;
using Flow.Net.Sdk.Client;
using Flow.Net.Sdk.Crypto;
using Flow.Net.Sdk.Exceptions;
using Flow.Net.Sdk.Models;

namespace WebApi
{
    public class FlowConfig
    {
        public string Host { get; set; }
        public string CadencePath { get; set; }
        public string AccountName { get; set; }
    }

    public interface IFlow
    {
        Task<FlowTransactionResult> ExecuteTransaction(string scriptName,
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
        private readonly string _transactionsPath;

        public string AccountAddress => _delphaiAddress?.HexValue;

        private FlowInterface(FlowClientAsync client, FlowAccount account, string transactionsPath)
        {
            _delphaiAddress = account.Address;
            _signer = account.Keys
                .Where(x => x.Index == KEY_INDEX)
                .Select(x => x.Signer)
                .FirstOrDefault();
            if(_signer is null)
            {
                throw new FlowException($"No key found with index {KEY_INDEX}");
            }
            _flowClient = client;
            _transactionsPath = transactionsPath;
        }

        public static async Task<FlowInterface> CreateInstance(FlowConfig config)
        {
            var client = new FlowClientAsync(config.Host);
            var account = await client.ReadAccountFromConfigAsync(config.AccountName,
                configPath: config.CadencePath);
            var transactionsPath = Path.Combine(config.CadencePath, "transactions");
            return new FlowInterface(client, account, transactionsPath);

        }

        public async Task<FlowTransactionResult> ExecuteTransaction(
            string scriptName, List<ICadence> arguments=default,
            Dictionary<string, string> addressMap = default, 
            int gasLimit=DEFAULT_GAS_LIMIT)
        {
            var txBody = Utilities.ReadCadenceScript(scriptName, _transactionsPath);

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

            tx = FlowTransaction.AddEnvelopeSignature(tx, _delphaiAddress, KEY_INDEX,
                _signer);

            var rawResponse = await _flowClient.SendTransactionAsync(tx);
            var response = await _flowClient.GetTransactionResultAsync(rawResponse.Id);
            if(!string.IsNullOrEmpty(response.ErrorMessage))
                throw new FlowException(response.ErrorMessage);
            return response;
        }
    }
}