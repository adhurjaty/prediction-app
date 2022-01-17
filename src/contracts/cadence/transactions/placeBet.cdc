import YesNoBetLibrary from 0xdelphai
import DelphaiUsers from 0xdelphai
import FlowToken from 0xFlowToken

transaction(betId: String, prediction: Bool, wager: UFix64) {
    let delphaiUser: &DelphaiUsers.DelphaiUser
    let flowVaultRef: &FlowToken.Vault

    prepare(acct: AuthAccount) {
        self.delphaiUser = acct.borrow<&DelphaiUsers.DelphaiUser>(
            from: /storage/DelphaiUser)
            ?? panic("Could not get vault reference")

        self.flowVaultRef = acct.borrow<&FlowToken.Vault>(
            from: /storage/flowTokenVault)
            ?? panic("Could not get flow vault reference")
    }

    execute {
        let betToken <- self.delphaiUser.betTokenVault.withdraw(betId: betId) 
            as! @YesNoBetLibrary.YesNoBetToken

        let flowVault <- self.flowVaultRef.withdraw(amount: wager)

        betToken.makeBet(prediction: prediction, wager: <-flowVault)

        let betResource <- YesNoBetLibrary.createDummyYesNoBet(numMembers: 5)
        let resultingVault <- betResource.makeBet(bet: <- betToken)
        destroy betResource
        destroy resultingVault
    }
}
