import BetContractComposer from 0xf8d6e0586b0a20c7

transaction {
    prepare(acct: AuthAccount) {

    }

    execute {
        BetContractComposer.makeBet(prediction: true)
        BetContractComposer.makeBet(prediction: false)
        BetContractComposer.voteToResolve(vote: true)
        log(BetContractComposer.getResult())
        BetContractComposer.voteToResolve(vote: false)
        log(BetContractComposer.getResult())
        BetContractComposer.voteToResolve(vote: false)
        log(BetContractComposer.getResult())
        BetContractComposer.voteToResolve(vote: true)
        log(BetContractComposer.getResult())
        BetContractComposer.voteToResolve(vote: true)
        log(BetContractComposer.getResult())
    }
}
 