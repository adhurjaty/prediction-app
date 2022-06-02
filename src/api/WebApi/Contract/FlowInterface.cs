using System;
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
using Flow.Net.Sdk.Templates;

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

        private readonly FlowAccount _account;
        private readonly FlowClientAsync _flowClient;
        private readonly string _transactionsPath;

        private FlowAddress _delphaiAddress => _account?.Address;
        private ISigner _signer => _account.Keys
            .Where(x => x.Index == KEY_INDEX)
            .Select(x => x.Signer)
            .FirstOrDefault() 
            ?? throw new FlowException($"No key found with index {KEY_INDEX}");
        public string AccountAddress => _delphaiAddress?.HexValue;

        private FlowInterface(FlowClientAsync client, FlowAccount account, string transactionsPath)
        {
            _account = account;
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
            // Get the latest account info for this address
            var delphaiAccount = await _flowClient.GetAccountAtLatestBlockAsync(
                _delphaiAddress);
            var key = _account.Keys.FirstOrDefault(x => x.Index == KEY_INDEX)
                ?? throw new FlowException($"No key found with index {KEY_INDEX}");
            delphaiAccount.Keys = FlowAccountKey.UpdateFlowAccountKeys(new List<FlowAccountKey> { key },
                delphaiAccount.Keys);

            return await ExecuteTransaction(scriptName, delphaiAccount, arguments,
                addressMap, gasLimit);
        }

        // only exposed for script or testing -- not in the interface
        public async Task<FlowTransactionResult> ExecuteTransaction(
            string scriptName, FlowAddress address, FlowAccountKey key,
            List<ICadence> arguments=default,
            Dictionary<string, string> addressMap = default, 
            int gasLimit=DEFAULT_GAS_LIMIT)
        {
            // Get the latest account info for this address
            var account = await _flowClient.GetAccountAtLatestBlockAsync(address);
            account.Keys = FlowAccountKey.UpdateFlowAccountKeys(new List<FlowAccountKey> { key },
                _account.Keys);

            return await ExecuteTransaction(scriptName, account, arguments,
                addressMap, gasLimit);
        }

        private async Task<FlowTransactionResult> ExecuteTransaction(
            string scriptName, FlowAccount account, 
            List<ICadence> arguments=default,
            Dictionary<string, string> addressMap = default, 
            int gasLimit=DEFAULT_GAS_LIMIT)
        {
            var txBody = Utilities.ReadCadenceScript(scriptName, _transactionsPath);

            // Get the latest sealed block to use as a reference block
            var latestBlock = await _flowClient.GetLatestBlockHeaderAsync();

            var key = account.Keys.FirstOrDefault(x => x.Index == KEY_INDEX)
                ?? throw new FlowException($"No key found with index {KEY_INDEX}");;
            var sequenceNumber = key.SequenceNumber;

            var tx = new FlowTransaction
            {
                Script = txBody,
                GasLimit = (ulong)gasLimit,
                ProposalKey = new FlowProposalKey
                {
                    Address = account.Address,
                    KeyId = KEY_INDEX,
                    SequenceNumber = sequenceNumber
                },
                Payer = account.Address,
                ReferenceBlockId = latestBlock.Id,
                Authorizers = new List<FlowAddress>()
                {
                    account.Address
                },
                Arguments = arguments ?? new List<ICadence>(),
                EnvelopeSigners = new List<FlowSigner>()
                {
                    new FlowSigner()
                    {
                        Address = account.Address.Value,
                        Signer = key.Signer,
                        KeyId = KEY_INDEX
                    }
                },
                AddressMap = addressMap ?? new Dictionary<string, string>()
                    .Merge(new Dictionary<string, string>()
                    {
                        { "delphai", _delphaiAddress.HexValue }
                    })
            };

            var rawResponse = await _flowClient.SendTransactionAsync(tx);
            var response = await _flowClient.GetTransactionResultAsync(rawResponse.Id);
            if(!string.IsNullOrEmpty(response.ErrorMessage))
                throw new FlowException(response.ErrorMessage);
            return response;
        }

        public async Task<FlowTransactionResult> CreateAccount(FlowAccountKey key)
        {
            var tx = Account.CreateAccount(new List<FlowAccountKey> { key }, 
                _delphaiAddress);

            var delphaiAccount = await _flowClient.GetAccountAtLatestBlockAsync(
                _delphaiAddress);

            // Get the latest sequence number for this key
            var delphaiKey = delphaiAccount.Keys.FirstOrDefault(w => 
                w.Index == KEY_INDEX);
            var sequenceNumber = delphaiKey.SequenceNumber;

            // set the transaction payer and proposal key
            tx.Payer = _delphaiAddress;
            tx.ProposalKey = new FlowProposalKey
            {
                Address = _delphaiAddress,
                KeyId = KEY_INDEX,
                SequenceNumber = sequenceNumber
            };

            // get the latest sealed block to use as a reference block
            var latestBlock = await _flowClient.GetLatestBlockAsync();
            tx.ReferenceBlockId = latestBlock.Id;

            // sign and submit the transaction
            tx = FlowTransaction.AddEnvelopeSigner(tx, _delphaiAddress, KEY_INDEX, _signer);

            var response = await _flowClient.SendTransactionAsync(tx);

            // wait for seal
            var sealedResponse = await _flowClient.WaitForSealAsync(response);

            if (sealedResponse.Status != Flow.Net.Sdk.Protos.entities.TransactionStatus.Sealed)
                return null;

            return sealedResponse;
        }
    }
}