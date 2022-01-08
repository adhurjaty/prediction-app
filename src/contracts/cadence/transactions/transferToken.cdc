import YesNoBetLibrary from 0xdelphai

transaction(betId: String, receiverAddresses: [Address]) {
    let minterRef: &YesNoBetLibrary.YesNoBetTokenMinter
    let bankRef: &YesNoBetLibrary.YesNoBetBankRepo

    prepare(acct: AuthAccount) {

        self.minterRef = acct.borrow<&YesNoBetLibrary.YesNoBetTokenMinter>(
            from: YesNoBetLibrary.yesNoBetMinterStoragePath)
            ?? panic("Could not borrow minter")

        self.bankRef = acct.borrow<&YesNoBetLibrary.YesNoBetBankRepo>(
            from: YesNoBetLibrary.yesNoBetBankRepoStoragePath)
            ?? panic("Could not borrow bank")
    }

    execute {
        let addressesToCache: [Address] = []
        for address in receiverAddresses {
            let receiverCap = getAccount(address).getCapability<&AnyResource{YesNoBetLibrary.YesNoBetReceiver}>(
                /public/YesNoBetVault);
            let receiver = receiverCap.borrow()
            if receiver != nil {
                let token <- self.minterRef.createToken(betId: betId, address: address)
                receiver!.receive(token: <-token)
            } else {
                addressesToCache.append(address)
            }
        }

        self.bankRef.cacheTokens(betId: betId, members: addressesToCache)
    }
}