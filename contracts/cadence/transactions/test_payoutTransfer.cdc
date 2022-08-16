import PayoutInterfaces from 0xdelphai

transaction(betId: String, address: Address) {
    let tokenMinter: &PayoutInterfaces.TokenMinter

    prepare(acct: AuthAccount) {
        self.tokenMinter = acct.borrow<&PayoutInterfaces.TokenMinter>(from: /storage/PayoutTokenMinter)
            ?? panic("Could not borrow PayoutInterfaces.TokenMinter from storage")
    }

    execute {
        let pathName = "PayoutToken_".concat(betId)
        let publicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")
        let payoutRef = getAccount(delphai)
            .getCapability<&AnyResource{PayoutInterfaces.Payout}>(publicPath!)
            .borrow()
            ?? panic("Could not borrow payout capability")

        payoutRef.deposit(from: <-self.flowVault.withdraw(amount: amount))
    }
}