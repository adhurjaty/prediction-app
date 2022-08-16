import WinLosePayout from 0xdelphai

transaction(betId: String, winningAddresses: [Address], winningAmounts: [UFix64], losingAddresses: [Address], losingAmounts: [UFix64]) {
    prepare(acct: AuthAccount) {
        let resultsMinterMinter = acct
            .borrow<&WinLosePayout.BetResultsTokenMinterMinter>(from: WinLosePayout.BetResultsMinterMinterStoragePath)
            ?? panic("Could not borrow a reference to the BetResultsTokenMinterMinter")
        let resultsMinter <- resultsMinterMinter.mint()

        let pathName = "WinLosePayout_".concat(betId)
        let payoutStoragePath = StoragePath(identifier: pathName)
            ?? panic("Invalid storage path")
        let payout = acct.borrow<&WinLosePayout.Payout>(from: payoutStoragePath!) 
            ?? panic("Could not borrow payout")

        let winners: [WinLosePayout.Bettor] = []
        let losers: [WinLosePayout.Bettor] = []
        var i = 0
        while i < winningAddresses.length {
            winners.append(WinLosePayout.Bettor(address: winningAddresses[i], amount: winningAmounts[i]))
            i = i + 1
        }

        i = 0
        while i < losingAddresses.length {
            losers.append(WinLosePayout.Bettor(address: losingAddresses[i], amount: losingAmounts[i]))
            i = i + 1
        }


        let results <- resultsMinter.mint(betId: betId, winners: winners, losers: losers)
        payout.resolve(token: <-results)

        destroy resultsMinter
    }
}