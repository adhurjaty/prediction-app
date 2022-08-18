import BetInterfaces from 0xdelphai

transaction(betId: String, address: Address) {
    let tokenMinter: &AnyResource{BetInterfaces.TokenMinter}

    prepare(acct: AuthAccount) {
        let pathName = BetInterfaces.betPathName(betId: betId)
        let betPrivatePath = PrivatePath(identifier: pathName)
            ?? panic("Invalid private path")
        self.tokenMinter = acct
            .getCapability(betPrivatePath!)
            .borrow<&AnyResource{BetInterfaces.TokenMinter}>()
            ?? panic("Could not borrow BetInterfaces.TokenMinter from storage")
    }

    execute {
        let receiver = getAccount(address)
            .getCapability<&AnyResource{BetInterfaces.Receiver}>(
                /public/betTokenReceiver)!
            .borrow()
            ?? panic("Could not borrow BetInterfaces.betTokenReceiver from public account")
        
        let betToken <-self.tokenMinter.mintToken(address: address)

        receiver.deposit(token: <-betToken)
    }
}