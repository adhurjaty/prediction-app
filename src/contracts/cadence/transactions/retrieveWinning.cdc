import DelphaiUsers from 0xdelphai
import BetContractComposer from 0xdelphai
import FlowToken from 0xFlowToken

transaction(delphai: Address, betId: String) {
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
        let claimToken <- self.delphaiUser.claimTokenVault.withdraw(betId: betId)

        let composerRef = getAccount(delphai)
            .getCapability<&BetContractComposer.ContractComposer>(
                /public/betId1234)!
            .borrow()
            ?? panic("Could not get bet composer")

        let winningVault <-composerRef.retrieveWinning(claimToken: <-claimToken)
        self.flowTokenVaultRef.deposit(from: <-winningVault)
    }
}