import YesNoResolverLibrary from 0xdelphai

transaction() {
    prepare(acct: AuthAccount) {
        acct.save(<-YesNoResolverLibrary.createYesNoVoteVault(), 
            to: /storage/YesNoVoteVault)
        acct.link<&AnyResource{YesNoResolverLibrary.YesNoVoteReceiver}>(
            /public/YesNoVoteVault, target: /storage/YesNoVoteVault)
    }
}