import YesNoBetLibrary from 0xdelphai
import YesNoResolverLibrary from 0xdelphai
import DelphaiUsers from 0xdelphai

transaction(betId: String, receiverAddresses: [Address]) {
    let betTokenMinterRef: &YesNoBetLibrary.YesNoBetTokenMinter
    let resolutionTokenMinterRef: &YesNoResolverLibrary.YesNoResolutionTokenMinter

    prepare(acct: AuthAccount) {

        self.betTokenMinterRef = acct.borrow<&YesNoBetLibrary.YesNoBetTokenMinter>(
            from: YesNoBetLibrary.yesNoBetMinterStoragePath)
            ?? panic("Could not borrow bet token minter")
        self.resolutionTokenMinterRef = acct.borrow<&YesNoResolverLibrary.YesNoResolutionTokenMinter>(
            from: YesNoResolverLibrary.yesNoResolutionMinterStoragePath)
            ?? panic("Could not borrow resolution token minter")
    }

    execute {
        for address in receiverAddresses {
            let receiver = getAccount(address)
                .getCapability<&AnyResource{DelphaiUsers.TokenReceiver}>(
                    /public/DelphaiUser)!
                .borrow()
                ?? panic("Could not get token receiver capability")
            let betToken <- self.betTokenMinterRef.createToken(betId: betId, address: address)
            receiver.depositBetToken(token: <-betToken)
            let resolutionToken <-self.resolutionTokenMinterRef.createToken(
                betId: betId, address: address)
            receiver.depositResolutionToken(token: <-resolutionToken)
        }
    }
}