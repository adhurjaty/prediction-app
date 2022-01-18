import BetContractComposer from 0xdelphai

transaction(betId: String, numMembers: Int) {
    prepare(acct: AuthAccount) {
        let adminRef = acct.borrow<&BetContractComposer.Administrator>(
            from: /storage/BetAdmin)
            ?? panic("Could not get admin reference")
        
        acct.save(<-adminRef.createContractComposer(numMembers: numMembers),
            to: /storage/betId1234)
        acct.link<&BetContractComposer.ContractComposer>(/public/betId1234,
            target: /storage/betId1234)
    }
}