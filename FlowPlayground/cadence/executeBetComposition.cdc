import BetContractComposer from 0xf8d6e0586b0a20c7

transaction {
    prepare(acct: AuthAccount) {

    }

    execute {
        let composer <- BetContractComposer.createContractComposer()
        composer.makeBet(prediction: true)
        composer.makeBet(prediction: false)
        composer.voteToResolve(vote: true)
        log(composer.getResult())
        composer.voteToResolve(vote: false)
        log(composer.getResult())
        composer.voteToResolve(vote: false)
        log(composer.getResult())
        composer.voteToResolve(vote: true)
        log(composer.getResult())
        composer.voteToResolve(vote: true)
        log(composer.getResult())
        destroy composer
    }
}
 