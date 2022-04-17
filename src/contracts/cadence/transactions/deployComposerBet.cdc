import BetContractComposer from 0xdelphai

transaction(betId: String, numMembers: Int) {
    prepare(acct: AuthAccount) {
        let adminRef = acct.borrow<&BetContractComposer.Administrator>(
            from: /storage/BetAdmin)
            ?? panic("Could not get admin reference")
        
        let path = StoragePath(identifier: betId)
        let publicPath = PublicPath(identifier: betId)
        acct.save(<-adminRef.createContractComposer(numMembers: numMembers),
            to: path!)
        acct.link<&BetContractComposer.ContractComposer>(publicPath!,
            target: path!)
    }
}