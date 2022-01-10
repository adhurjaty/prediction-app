import YesNoResolverLibrary from 0xdelphai

transaction(betId: String, receiverAddresses: [Address]) {
    let minterRef: &YesNoResolverLibrary.YesNoVoteTokenMinter

    prepare(acct: AuthAccount) {

        self.minterRef = acct.borrow<&YesNoResolverLibrary.YesNoVoteTokenMinter>(
            from: YesNoResolverLibrary.yesNoVoteMinterStoragePath)
            ?? panic("Could not borrow minter")
    }

    execute {
        for address in receiverAddresses {
            let receiverCap = getAccount(address).getCapability<&AnyResource{YesNoResolverLibrary.YesNoVoteReceiver}>(
                /public/YesNoVoteVault);
            let receiver = receiverCap.borrow()
            
            if receiver == nil {
                panic("Address '"
                    .concat(address.toString())
                    .concat("' does not have vote token vault")
                );
            }

            let token <- self.minterRef.createToken(betId: betId, address: address)
            receiver!.receive(token: <-token)
        }
    }
}