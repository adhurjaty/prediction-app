import ResolverInterfaces from 0xdelphai

transaction() {
    prepare(acct: AuthAccount) {
        acct.save(<-ResolverInterfaces.createVault(), to: /storage/delphaiResolverTokenVault)
        acct.link<&AnyResource{ResolverInterfaces.Receiver}>(/public/delphaiResolverTokenReceiver, 
            target: /storage/delphaiResolverTokenVault)
    }
}