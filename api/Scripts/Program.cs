using WebApi;
using Newtonsoft.Json;
using Infrastructure;
using ServiceStack.OrmLite;
using Flow.Net.Sdk.Models;
using Flow.Net.Sdk;

namespace Scripts;

public static class Program
{
    public static async Task Main(string[] args)
    {

        var configFile = File.ReadAllText("../WebApi/appsettings.Development.json");
        var appSettings = JsonConvert.DeserializeObject<SettingsConfig>(configFile);

        var connectionString = appSettings.DbConfig.ConnectionString();
        var dbFactory = new OrmLiteConnectionFactory(connectionString,
            PostgreSqlDialect.Provider);
        var dbInt = new DatabaseInterface(dbFactory);
        var strategyFactory = new DbStrategyFactory(typeof(Startup).Assembly.GetTypes());
        var db = new ModelsDatbaseInterface(dbInt, strategyFactory);

        var config = appSettings.FlowSettings;
        config.CadencePath = "../WebApi/Contract/Cadence";
        var contracts = await ContractsInterface.CreateInstance(appSettings.FlowSettings);

        var bets = (await db.Select<Bet>()).ValueOrDefault(new List<Bet>());

        var existingBets = new List<BetSpec>()
        {
            new BetSpec(
                bets.First(x => x.Title.Contains("Lebron")).Id.ToString(),
                new string[]
                {
                    "0xf3fcd2c1a78f5eee",
                    "0x179b6b1cb6755e31",
                    "0xe03daebed8ca0615"
                }
            ),
            new BetSpec(
                bets.First(x => x.Title.Contains("Ari")).Id.ToString(),
                new string[]
                {
                    "0x179b6b1cb6755e31",
                    "0xe03daebed8ca0615"
                }
            )
        };

        // seed user accounts
        var dan = "Dan Mcleod";
        var tony = "Tony Wong";
        var anil = "Anil Dhurjaty";
        var tester = "Tester"; // used when I added another user via the UI

        (await contracts.MintFUSD())
            .Either(res => res, res => throw new Exception(res.Failure));

        var accountList = new List<AccountInfo>();

        foreach (var acct in new[] { dan, tony, anil, tester })
        {
            var key = FlowAccountKey.GenerateRandomEcdsaKey(SignatureAlgo.ECDSA_P256, HashAlgo.SHA3_256, 1000);
            var address = "";

            // create accounts and update their flow addresses
            (await (await (await (await contracts.CreateAccount(key))
                .Tee(account => address = account.Address.HexValue)
                .TeeResult(async account =>
                {
                    return await (await contracts.TransferFlow(account.Address, 20))
                        .Bind(() => contracts.TransferFUSD(account.Address, 20));
                }))
                .TupleBind(account =>
                    db.Single<AppUser>(x => x.DisplayName == acct)))
                .TeeResult(async (account, user) =>
                {
                    user.MainnetAddress = account.Address.HexValue;
                    // hack to get update to work
                    user.FriendsRelations = new List<FriendsRelation>();
                    return await (await db.Update(user))
                        .Bind(() => contracts.SetupDelphaiUser(account));

                }))
                .Tee((account, _) =>
                {
                    var firstName = acct.Split(' ').FirstOrDefault(acct).ToLower();
                    accountList.Add(new AccountInfo(
                        firstName, 
                        address, 
                        key.PrivateKey,
                        account));
                });

        }

        var template = File.ReadAllText("wallet_flow.json.template");
        var accountsString = string.Join(",\n", accountList.Select(x => x.Serialize()));
        var json = template.Replace("$accounts$", accountsString);
        File.WriteAllText("../../contracts/wallet_flow.json", json);

        (await db.Select<AppUser>(u => Sql.In(u.DisplayName, new[] { dan, tony, anil })))
            .Tee(users =>
            {
                var orderedUsers = users.OrderBy(x => x.DisplayName).ToArray();
                var (anil, dan, tony) = (orderedUsers[0], orderedUsers[1], orderedUsers[2]);
                existingBets[0] = existingBets[0] with
                {
                    Addresses = orderedUsers.Select(x => x.MainnetAddress).ToArray()
                };
                existingBets[1] = existingBets[1] with
                {
                    Addresses = new[] { anil, dan }.Select(x => x.MainnetAddress).ToArray()
                };
            });

        foreach (var bet in existingBets)
        {
            var result = await (await CreateBetContracts(contracts, bet.BetId, bet.Addresses.Length))
                .Bind(() => accountList.Select(user => 
                    contracts.TransferTokens(user.Account, bet.BetId)).Aggregate());
            if (result.IsFailure)
                throw new Exception(result.Failure);
        }
    }

    private static async Task<Result> CreateBetContracts(IContracts contract, string betId, int size)
    {
        // TODO: set up rollbacks if any of these fail
        return await (await (await (await contract.CreateWinLosePayout(betId))
            .Bind(() => contract.CreateYesNoBet(betId)))
            .Bind(() => contract.CreateYesNoResolver(betId, size)))
            .Bind(() => contract.CreateComposer(betId));
    }

}


public record SettingsConfig
{
    public WebApi.FlowConfig FlowSettings { get; set; }
    public DbConfig DbConfig { get; set; }
}

public record AccountInfo(
    string Name,
    string Address,
    string PrivateKey,
    FlowAccount Account
)
{
    public string Serialize()
    {
        return $"\"{Name}\": {{ \"address\": \"{Address}\", \"key\": \"{PrivateKey}\" }}";
    }
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

"dan": {
    "address": "01cf0e2f2f715450",
    "publicKey": "4e14e62df7e0422c8f3c13c9f55e63f7bb43fd713fbc6294955457ccfcb3aa21a3dcc6dde13685208686834dcd00e9acef032b73d4033a3f1bfac53ebdeb295a",
    "key": "39fef4dbb0ba50de91e3f841a2106e6a1b060a309cb6423a2b5f2d8a43406cb0"
},
"tony": {
    "address": "179b6b1cb6755e31",
    "publicKey": "1f928fa6d8ed0723a8cd1f8dda5aef423453c3b6c4acbfad0f19f0d48ac7eeb7642817209c08e2c4313de516fe48c37169f47df4c9c6057c3ffe098819b2a282",
    "key": "c64520aad103a3f37a26f03ee7c7a13112f6c8626ac23c4b592849b61058fb97"
},
"anil": {
    "address": "f3fcd2c1a78f5eee",
    "publicKey": "47ea07ff0f8b71d3cfe669f6fb2b11a3d79e7ac900f4e0df7c9591d791408c270435655a49e550f484621da60e9b758b68c96f8087bc36c67f726e4a6e174919",
    "key": "e4a8c8fcdfad781bfd417b6408ff201da61406f9e56b0b2d1514e7ef7c2d801b"
}

*/