import PayoutInterfaces from 0xdelphai
import WinLosePayout from 0xdelphai

transaction(betId: String, winningAddresses: [Address], winningAmounts: [UFix64], losingAddresses: [Address], losingAmounts: [UFix64]) {
    let payout: &WinLosePayout.Payout
    
    prepare(acct: AuthAccount) {
        let pathName = PayoutInterfaces.payoutPathName(betId: betId)
        let payoutStoragePath = StoragePath(identifier: pathName)
            ?? panic("Invalid storage path")
        self.payout = acct.borrow<&WinLosePayout.Payout>(from: payoutStoragePath!) 
            ?? panic("Could not borrow payout")
    }

    execute {
        let resultsMinter <- self.payout.createBetTokenMinter()

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

        let results <- resultsMinter.mint(winners: winners, losers: losers)
        self.payout.resolve(token: <-results)

        destroy resultsMinter
    }
}