import YesNoBetLibrary from 0xdelphai

transaction(betId: String, prediction: Bool, wager: Int) {
    prepare(acct: AuthAccount) {
        let vaultCap = acct.borrow<&YesNoBetLibrary.YesNoBetVault>(
            from: /storage/YesNoBetVault)
            ?? panic("Could not get vault capability")

        let betToken <- vaultCap.withdraw()

        betToken.makeBet(prediction: prediction, wager: wager)

        let betResource <- YesNoBetLibrary.createDummyYesNoBet(numMembers: 5)
        betResource.makeBet(bet: <- betToken)
        destroy betResource
    }
}
