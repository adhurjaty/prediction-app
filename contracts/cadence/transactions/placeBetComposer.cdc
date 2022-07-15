import BetContractComposer from 0xdelphai
import DelphaiUsers from 0xdelphai
import YesNoBetLibrary from 0xdelphai
import FlowToken from FlowToken

transaction(delphai: Address, betId: String, prediction: Bool, wager: UFix64) {
    let delphaiUser: &DelphaiUsers.DelphaiUser
    let flowTokenVaultRef: &FlowToken.Vault

    prepare(acct: AuthAccount) {
        self.delphaiUser = acct.borrow<&DelphaiUsers.DelphaiUser>(
            from: /storage/DelphaiUser)
            ?? panic("Could not get vault reference")

        self.flowTokenVaultRef = acct.borrow<&FlowToken.Vault>(
            from: /storage/flowTokenVault)
            ?? panic("Could not get Flow Token vault reference")
    }

    execute {
        let betToken <- self.delphaiUser.betTokenVault.withdraw(betId: betId) 
            as! @YesNoBetLibrary.YesNoBetToken

        let flowTokenVault <- self.flowTokenVaultRef.withdraw(amount: wager)

        betToken.makeBet(prediction: prediction, wager: <-flowTokenVault)

        let betPath = PublicPath(identifier: betId)
        let composerRef = getAccount(delphai)
            .getCapability<&BetContractComposer.ContractComposer>(betPath!)!
            .borrow()
            ?? panic("Could not get bet composer")
        composerRef.makeBet(bet: <-betToken)
    }
}
