import ResolverInterfaces from 0xdelphai

transaction(betId: String) {
    let resolverRef: &AnyResource{ResolverInterfaces.Resolver}
    
    prepare(acct: AuthAccount) {
        let resolverPathName = ResolverInterfaces.resolverPathName(betId: betId)
        let resolverPublicPath = PublicPath(identifier: resolverPathName)
            ?? panic("Invalid public path")
        self.resolverRef = acct
            .getCapability<&AnyResource{ResolverInterfaces.Resolver}>(resolverPublicPath!)
            .borrow()
            ?? panic("Could not borrow resolver capability")
    }

    execute {
        self.resolverRef.resolve()
    }
}