import DelphaiResources from 0xdelphai
import ResolverInterfaces from 0xdelphai

transaction(delphai: Address, betId: String) {
    let delphaiUser: &DelphaiResources.User
    let receiver: &AnyResource{ResolverInterfaces.Receiver}

    prepare(acct: AuthAccount) {
        self.delphaiUser = acct.borrow<&DelphaiResources.User>(from: /storage/delphaiUser)
            ?? panic("Could not borrow DelphaiResources.User from storage")

        self.receiver = acct
            .getCapability<&AnyResource{ResolverInterfaces.Receiver}>(
                /public/delphaiResolverTokenReceiver)!
            .borrow()
            ?? panic("Could not borrow ResolverInterfaces.ResolverTokenReceiver from account")
    }

    execute {
        let pathName = ResolverInterfaces.resolverPathName(betId: betId)
        let resolverPublicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")
        let resolver = getAccount(delphai)
            .getCapability(resolverPublicPath!)
            .borrow<&AnyResource{ResolverInterfaces.Resolver}>()
            ?? panic("Could not borrow ResolverInterfaces.TokenMinter from public path")
        
        let accessToken <- self.delphaiUser.createToken(betId: betId)
        let results <-resolver.mintToken(token: <-accessToken)

        self.receiver.deposit(token: <-results.getToken())

        destroy results
    }
}