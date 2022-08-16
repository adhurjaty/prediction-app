import FlowToken from 0xFlowToken
import PayoutInterfaces from 0xdelphai

transaction(delphai: Address, betId: String, amount: UFix64) {
    let flowVault: &FlowToken.Vault

    prepare(acct: AuthAccount) {
        self.flowVault = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow FlowToken.Vault from storage")
    }

    execute {
        let pathName = "WinLosePayout_".concat(betId)
        let publicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")
        let payoutRef = getAccount(delphai)
            .getCapability<&AnyResource{PayoutInterfaces.Payout}>(publicPath!)
            .borrow()
            ?? panic("Could not borrow payout capability")

        payoutRef.deposit(from: <-self.flowVault.withdraw(amount: amount))
    }
}