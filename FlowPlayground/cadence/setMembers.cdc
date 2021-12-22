import BetContractComposer, Delphai from 0xf8d6e0586b0a20c7

transaction {
    // let sharedAccount: AuthAccount

    prepare(acct: AuthAccount) {
        let account2 = getAccount(0x120e725050340cab)
        let account3 = getAccount(0xf669cb8d41ce0c74)
        log("here")
        log(account2)
        // self.sharedAccount = Delphai.createGroup(payer: acct, members: [account2, account3])
    }

    execute {
        // let composerCapability <- BetContractComposer.buildContractComposer(
        //     self.sharedAccount, "123")

        
        // let account4 = getAccount(0x192440c99cb17282)


        // var composer = account.getCapability()
        // composer.makeBet(prediction: true)
        // composer.makeBet(prediction: false)
        // composer.voteToResolve(vote: true)
        // log(composer.getResult())
        // composer.voteToResolve(vote: false)
        // log(composer.getResult())
        // composer.voteToResolve(vote: false)
        // log(composer.getResult())
        // composer.voteToResolve(vote: true)
        // log(composer.getResult())
        // composer.voteToResolve(vote: true)
        // log(composer.getResult())
        // destroy composer
    }
}
 