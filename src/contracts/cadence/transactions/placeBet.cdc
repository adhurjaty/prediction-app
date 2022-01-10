import YesNoBetLibrary from 0xdelphai
import FlowToken from 0xFlowToken

transaction(betId: String, prediction: Bool, wager: UFix64) {
    let vaultRef: &YesNoBetLibrary.YesNoBetVault
    let flowVaultRef: &FlowToken.Vault

    prepare(acct: AuthAccount) {
        self.vaultRef = acct.borrow<&YesNoBetLibrary.YesNoBetVault>(
            from: /storage/YesNoBetVault)
            ?? panic("Could not get vault reference")

        self.flowVaultRef = acct.borrow<&FlowToken.Vault>(
            from: /storage/flowTokenVault)
            ?? panic("Could not get flow vault reference")
    }

    execute {
        let betToken <- self.vaultRef.withdraw()

        let flowVault <- self.flowVaultRef.withdraw(amount: wager)

        betToken.makeBet(prediction: prediction, wager: <-flowVault)

        let betResource <- YesNoBetLibrary.createDummyYesNoBet(numMembers: 5)
        betResource.makeBet(bet: <- betToken)
        destroy betResource
    }
}
