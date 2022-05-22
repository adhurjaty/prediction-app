using WebApi;
using Newtonsoft.Json;
using Infrastructure;

namespace Scripts;

public static class Program
{
    public static async Task Main(string[] args)
    {

        var configFile = File.ReadAllText("../WebApi/appsettings.Development.json");
        var appSettings = JsonConvert.DeserializeObject<SettingsConfig>(configFile);
        var config = appSettings.FlowSettings;
        config.CadencePath = "../WebApi/Contract/Cadence";
        var contracts = await ContractsInterface.CreateInstance(appSettings.FlowSettings);

        var existingBets = new List<BetSpec>()
        {
            new BetSpec(
                "b4a6dfd6-58a0-46fa-9f9f-9be17ead0c9c",
                new string[]
                {
                    "0xf3fcd2c1a78f5eee",
                    "0x179b6b1cb6755e31",
                    "0xe03daebed8ca0615"
                }
            ),
            new BetSpec(
                "052ef31c-7d3e-408d-8bc6-e778d2cd5644",
                new string[]
                {
                    "0x179b6b1cb6755e31",
                    "0xe03daebed8ca0615"
                }
            )
        };

        foreach (var bet in existingBets)
        {
            await (await contracts.DeployComposerBet(bet.BetId, bet.Addresses.Length))
                .Bind(() => contracts.TransferTokens(bet.BetId, bet.Addresses));
        }
    }
}



public record SettingsConfig
{
    public FlowConfig FlowSettings { get; set; }
}

public record BetSpec(
    string BetId,
    string[] Addresses
);

/*
b4a6dfd6-58a0-46fa-9f9f-9be17ead0c9c | Will Lebron Have 5 Rings           | Sooth Sayans | Tony Wong     | 0xf3fcd2c1a78f5eee
b4a6dfd6-58a0-46fa-9f9f-9be17ead0c9c | Will Lebron Have 5 Rings           | Sooth Sayans | Dan Mcleod    | 0x179b6b1cb6755e31
b4a6dfd6-58a0-46fa-9f9f-9be17ead0c9c | Will Lebron Have 5 Rings           | Sooth Sayans | Anil Dhurjaty | 0xe03daebed8ca0615
052ef31c-7d3e-408d-8bc6-e778d2cd5644 | Will Ari Propose to Erica by 11/07 | Bore-acles   | Dan Mcleod    | 0x179b6b1cb6755e31
052ef31c-7d3e-408d-8bc6-e778d2cd5644 | Will Ari Propose to Erica by 11/07 | Bore-acles   | Anil Dhurjaty | 0xe03daebed8ca0615
f4e30b01-9fcb-4e79-9720-c7bcd61109e4 | Some other prop                    | Bore-acles   | Dan Mcleod    | 0x179b6b1cb6755e31
f4e30b01-9fcb-4e79-9720-c7bcd61109e4 | Some other prop                    | Bore-acles   | Anil Dhurjaty | 0xe03daebed8ca0615
cd0ba4b4-165d-427d-918a-07f20b95f8c4 | afewf                              | Sooth Sayans | Tony Wong     | 0xf3fcd2c1a78f5eee
cd0ba4b4-165d-427d-918a-07f20b95f8c4 | afewf                              | Sooth Sayans | Dan Mcleod    | 0x179b6b1cb6755e31
cd0ba4b4-165d-427d-918a-07f20b95f8c4 | afewf                              | Sooth Sayans | Anil Dhurjaty | 0xe03daebed8ca0615


*/