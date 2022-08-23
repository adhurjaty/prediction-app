import FlowToken from 0xFlowToken
import PayoutInterfaces from 0xdelphai
import Composer from 0xdelphai

transaction(delphai: Address, betId: String) {
    let payoutVault: &PayoutInterfaces.Vault
    let flowVault: &FlowToken.Vault

    prepare(acct: AuthAccount) {
        self.payoutVault = acct
            .borrow<&PayoutInterfaces.Vault>(from: /storage/delphaiPayoutTokenVault)
            ?? panic("Could not borrow the Vault reference")
        
        self.flowVault = acct.borrow<&FlowToken.Vault>(
            from: /storage/flowTokenVault)
            ?? panic("Could not get Flow Token vault reference")
    }

    execute {
        let token <- self.payoutVault.withdraw(betId: betId)

        let pathName = Composer.composerPathName(betId: betId)
        let publicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")
        let composer = getAccount(delphai)
            .getCapability<&AnyResource{Composer.PublicComposer}>(publicPath!)
            .borrow()
            ?? panic("Could not borrow composer capability")

        let payoutFlowVault <- composer.retrievePayout(token: <-token)
        self.flowVault.deposit(from: <-payoutFlowVault)
    }
}