import DelphaiUsers from 0xdelphai
import BetContractComposer from 0xdelphai
import FUSD from 0xFUSD

transaction(delphai: Address, betId: String) {
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
        let claimToken <- self.delphaiUser.claimTokenVault.withdraw(betId: betId)

        let composerRef = getAccount(delphai)
            .getCapability<&BetContractComposer.ContractComposer>(
                /public/betId1234)!
            .borrow()
            ?? panic("Could not get bet composer")

        let winningVault <-composerRef.retrieveWinning(claimToken: <-claimToken)
        self.fusdVaultRef.deposit(from: <-winningVault)
    }
}