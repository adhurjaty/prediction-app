import BetContractComposer from 0xf8d6e0586b0a20c7

transaction {
    prepare(admin: AuthAccount) {
        let adminRef = admin.borrow<&BetContractComposer.Administrator>(
            from: /storage/composerAdmin) 
            ?? panic("Could not get admin capability")
        
        let composer <-adminRef.createContractComposer(numMembers: 2)

        admin.save(<-composer, to: /storage/contractComposer)
    }
}
 