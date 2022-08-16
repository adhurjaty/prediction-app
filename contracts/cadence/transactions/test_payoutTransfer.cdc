import PayoutInterfaces from 0xdelphai

transaction(betId: String, address: Address) {
    let tokenMinter: &PayoutInterfaces.TokenMinter

    prepare(acct: AuthAccount) {
        self.tokenMinter = acct.borrow<&PayoutInterfaces.TokenMinter>(from: /storage/PayoutTokenMinter)
            ?? panic("Could not borrow PayoutInterfaces.TokenMinter from storage")
    }

    execute {
        let receiver = getAccount(address)
            .getCapability<&AnyResource{PayoutInterfaces.Receiver}>(
                /public/payoutTokenReceiver)!
            .borrow()
            ?? panic("Could not borrow PayoutInterfaces.PayoutTokenReceiver from public account")
        
        let payoutToken <-self.tokenMinter.mint(betId: betId, address: address)

        receiver.deposit(token: <-payoutToken)
    }
}