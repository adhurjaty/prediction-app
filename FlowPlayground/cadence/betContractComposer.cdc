import BetsLibrary, ResolverLibrary from 0xf8d6e0586b0a20c7

pub contract BetContractComposer {
    priv let betPath: PublicPath
    priv let resolverPath: PublicPath

    init () {
        let storeBetPath = /storage/ComposerBetPath
        let storeResolverPath = /storage/ComposerResolverPath

        self.betPath = /public/ComposerBetPath
        self.resolverPath = /public/ComposerResolverPath

        self.account.save(
            <-create BetsLibrary.DummyYesNoBet(), 
            to: storeBetPath
        )
        self.account.save(
            <-create ResolverLibrary.MajorityYesNoResolver(numMembers: 5), 
            to: storeResolverPath
        )

        self.account.link<&BetsLibrary.DummyYesNoBet{BetsLibrary.YesNoBet}>(
            self.betsPath,
            target: storeBetPath
        )
        self.account.link<&ResolverLibrary.MajorityYesNoResolver{ResolverLibrary.YesNoResolver}>(
            self.resolverPath,
            target: storeResolverPath
        )
    }


}
 