import DelphaiResources from 0xdelphai
import BetInterfaces from 0xdelphai
import ResolverInterfaces from 0xdelphai
import PayoutInterfaces from 0xdelphai
import Composer from 0xdelphai

transaction(delphai: Address, betId: String) {
    let delphaiUser: &DelphaiResources.User
    let betReceiver: &AnyResource{BetInterfaces.Receiver}
    let resolverReceiver: &AnyResource{ResolverInterfaces.Receiver}
    let payoutReceiver: &AnyResource{PayoutInterfaces.Receiver}

    prepare(acct: AuthAccount) {
        self.delphaiUser = acct.borrow<&DelphaiResources.User>(from: /storage/delphaiUser)
            ?? panic("Could not borrow DelphaiResources.User from storage")

        self.betReceiver = acct
            .getCapability<&AnyResource{BetInterfaces.Receiver}>(
                /public/delphaiBetTokenReceiver)!
            .borrow()
            ?? panic("Could not borrow BetInterfaces.Receiver from account")

        self.resolverReceiver = acct
            .getCapability<&AnyResource{ResolverInterfaces.Receiver}>(
                /public/delphaiResolverTokenReceiver)!
            .borrow()
            ?? panic("Could not borrow ResolverInterfaces.Receiver from account")

        self.payoutReceiver = acct
            .getCapability<&AnyResource{PayoutInterfaces.Receiver}>(
                /public/delphaiPayoutTokenReceiver)!
            .borrow()
            ?? panic("Could not borrow PayoutInterfaces.Receiver from account")
    }

    execute {
        let pathName = Composer.composerPathName(betId: betId)
        let composerPublicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")
        let composer = getAccount(delphai)
            .getCapability(composerPublicPath!)
            .borrow<&AnyResource{Composer.PublicComposer}>()
            ?? panic("Could not borrow composer from public path")
        
        let accessToken <- self.delphaiUser.createToken(betId: betId)
        let tokens <-composer.mintTokens(token: <-accessToken)

        self.betReceiver.deposit(token: <-tokens.getBetToken())
        self.resolverReceiver.deposit(token: <-tokens.getResolverToken())
        self.payoutReceiver.deposit(token: <-tokens.getPayoutToken())

        destroy tokens
    }
}