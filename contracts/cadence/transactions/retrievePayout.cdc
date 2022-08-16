import PayoutInterfaces from 0xdelphai
import FlowToken from 0xFlowToken

transaction(delphai: Address, betId: String) {
    let payoutVault: &PayoutInterfaces.Vault
    let flowVault: &FlowToken.Vault

    prepare(acct: AuthAccount) {
        self.payoutVault = acct.borrow<&PayoutInterfaces.Vault>(from: /storage/payoutTokenVault)
            ?? panic("Could not borrow the Vault reference")
        
        self.flowVault = acct.borrow<&FlowToken.Vault>(
            from: /storage/flowTokenVault)
            ?? panic("Could not get Flow Token vault reference")
    }

    execute {
        let token <- self.payoutVault.withdraw(betId: betId)

        let pathName = "WinLosePayout_".concat(betId)
        let payoutPublicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")

        let payout = getAccount(delphai)
            .getCapability<&AnyResource{PayoutInterfaces.Payout}>(payoutPublicPath)
            .borrow()
            ?? panic("Could not borrow the Payout reference")
        
        let payoutFlowVault <- payout.withdraw(token: <-token)
        self.flowVault.deposit(from: <-payoutFlowVault)
    }
}