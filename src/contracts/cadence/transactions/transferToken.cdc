import YesNoBetLibrary from 0xdelphai

transaction(betId: String, receiverAddress: Address) {
    let minterRef: &YesNoBetLibrary.YesNoBetTokenMinter
    var receiver: &AnyResource{YesNoBetLibrary.YesNoBetReceiver}

    prepare(acct: AuthAccount) {
        let receiverCap = getAccount(receiverAddress).getCapability<&AnyResource{YesNoBetLibrary.YesNoBetReceiver}>(
            /public/YesNoBetVault);
        self.receiver = receiverCap.borrow() ?? panic("Could not get capability")
        
        self.minterRef = acct.borrow<&YesNoBetLibrary.YesNoBetTokenMinter>(
            from: YesNoBetLibrary.yesNoBetMinterStoragePath)
            ?? panic("Could not borrow minter")
    }

    execute {
        let token <- self.minterRef.createToken(betId: betId, address: receiverAddress)
        self.receiver.receive(token: <-token)
    }
}