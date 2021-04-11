using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace WebApi
{
    public class ContractFactory
    {
        private readonly BlockchainSettings _settings;
        private readonly string _combinedJsonContent;
        private Dictionary<string, DeployableContractInfo> _contractDict;

        public ContractFactory(BlockchainSettings settings,
            string jsonContent)
        {
            _settings = settings;
            _combinedJsonContent = jsonContent;
        }

        public DeployableContractInfo GetContractInfo(string name)
        {
            if(_contractDict is null)
                InitContractDict();
            return _contractDict[name];
        }

        private void InitContractDict()
        {
            var src = JObject.Parse(_combinedJsonContent);
            var contracts = src["contracts"] as JObject;

            _contractDict = contracts.Properties().ToDictionary(
                x => x.Name,
                x => CreateContractInfo(x.Value as JObject)
            );
        }

        private DeployableContractInfo CreateContractInfo(JObject value)
        {
            return new DeployableContractInfo()
            {
                Abi = value["abi"].ToString(Newtonsoft.Json.Formatting.None),
                Bin = value["bin"].ToString()
            };
        }
    }

    public class DeployableContractInfo
    {
        public string Abi { get; set; }
        public string Bin { get; set; }
    }
}