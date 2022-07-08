import BetContractComposer from 0xdelphai
import DelphaiUsers from 0xdelphai
import YesNoBetLibrary from 0xdelphai
import FUSD from 0xFUSD

transaction(delphai: Address, betId: String, prediction: Bool, wager: UFix64) {
    let delphaiUser: &DelphaiUsers.DelphaiUser
    let fusdVaultRef: &FUSD.Vault

    prepare(acct: AuthAccount) {
        self.delphaiUser = acct.borrow<&DelphaiUsers.DelphaiUser>(
            from: /storage/DelphaiUser)
            ?? panic("Could not get vault reference")

        self.fusdVaultRef = acct.borrow<&FUSD.Vault>(
            from: /storage/fusdVault)
            ?? panic("Could not get Flow Token vault reference")
    }

    execute {
        let betToken <- self.delphaiUser.betTokenVault.withdraw(betId: betId) 
            as! @YesNoBetLibrary.YesNoBetToken

        let fusdVault <- self.fusdVaultRef.withdraw(amount: wager)

        betToken.makeBet(prediction: prediction, wager: <-fusdVault)

        let betPath = PublicPath(identifier: betId)
        let composerRef = getAccount(delphai)
            .getCapability<&BetContractComposer.ContractComposer>(betPath!)!
            .borrow()
            ?? panic("Could not get bet composer")
        composerRef.makeBet(bet: <-betToken)
    }
}
