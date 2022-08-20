import PayoutInterfaces from 0xdelphai
import WinLosePayout from 0xdelphai

transaction(betId: String, winningAddresses: [Address], winningAmounts: [UFix64], losingAddresses: [Address], losingAmounts: [UFix64]) {
    let payout: &AnyResource{PayoutInterfaces.Payout}

    prepare(acct: AuthAccount) {
        let pathName = PayoutInterfaces.payoutPathName(betId: betId)
        let payoutPublicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")
        self.payout = acct
            .getCapability<&AnyResource{PayoutInterfaces.Payout}>(payoutPublicPath!)
            .borrow()
            ?? panic("Could not borrow payout")
    }

    execute {
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

        let results = WinLosePayout.Results(winners: winners, losers: losers)
        self.payout.resolve(results: results)
    }
}