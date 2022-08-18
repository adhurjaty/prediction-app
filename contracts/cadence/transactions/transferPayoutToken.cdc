import PayoutInterfaces from 0xdelphai

transaction(betId: String, address: Address) {
    let tokenMinter: &AnyResource{PayoutInterfaces.TokenMinter}

    prepare(acct: AuthAccount) {
        let pathName = PayoutInterfaces.payoutPathName(betId: betId)
        let payoutPrivatePath = PrivatePath(identifier: pathName)
            ?? panic("Invalid private path")
        self.tokenMinter = acct
            .getCapability(payoutPrivatePath!)
            .borrow<&AnyResource{PayoutInterfaces.TokenMinter}>()
            ?? panic("Could not borrow PayoutInterfaces.TokenMinter from storage")
    }

    execute {
        let receiver = getAccount(address)
            .getCapability<&AnyResource{PayoutInterfaces.Receiver}>(
                /public/payoutTokenReceiver)!
            .borrow()
            ?? panic("Could not borrow PayoutInterfaces.PayoutTokenReceiver from public account")
        
        let payoutToken <-self.tokenMinter.mintToken(address: address)

        receiver.deposit(token: <-payoutToken)
    }
}