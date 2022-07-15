import YesNoResolverLibrary from 0xdelphai
import DelphaiUsers from 0xdelphai

transaction(betId: String, receiverAddresses: [Address]) {
    let minterRef: &YesNoResolverLibrary.YesNoResolutionTokenMinter

    prepare(acct: AuthAccount) {

        self.minterRef = acct.borrow<&YesNoResolverLibrary.YesNoResolutionTokenMinter>(
            from: YesNoResolverLibrary.yesNoResolutionMinterStoragePath)
            ?? panic("Could not borrow minter")
    }

    execute {
        for address in receiverAddresses {
            let receiver = getAccount(address)
                .getCapability<&AnyResource{DelphaiUsers.TokenReceiver}>(
                    /public/DelphaiUser)!
                .borrow()
                ?? panic("Could not get token receiver capability")
            
            let token <- self.minterRef.createToken(betId: betId, address: address)
            receiver.depositResolutionToken(token: <-token)
        }
    }
}