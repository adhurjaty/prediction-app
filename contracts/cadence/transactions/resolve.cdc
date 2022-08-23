import Composer from 0xdelphai

transaction(betId: String) {
    let composer: &AnyResource{Composer.PublicComposer}
    
    prepare(acct: AuthAccount) {
        let pathName = Composer.composerPathName(betId: betId)
        let publicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")
        self.composer = acct
            .getCapability<&AnyResource{Composer.PublicComposer}>(publicPath!)
            .borrow()
            ?? panic("Could not borrow composer capability")
    }

    execute {
        self.composer.resolve()
    }
}