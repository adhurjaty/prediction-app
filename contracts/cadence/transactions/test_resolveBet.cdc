import PayoutInterfaces from 0xdelphai
import BetInterfaces from 0xdelphai
import YesNoBet from 0xdelphai

transaction(betId: String, outcome: Bool?) {
    let bet: &YesNoBet.Bet
    let payoutRef: &AnyResource{PayoutInterfaces.Payout}
    
    prepare(acct: AuthAccount) {
        let pathName = BetInterfaces.betPathName(betId: betId)
        let betStoragePath = StoragePath(identifier: pathName)
            ?? panic("Invalid storage path")
        self.bet = acct.borrow<&YesNoBet.Bet>(from: betStoragePath!) 
            ?? panic("Could not borrow bet")

        let payoutPathName = PayoutInterfaces.payoutPathName(betId: betId)
        let payoutPublicPath = PublicPath(identifier: payoutPathName)
            ?? panic("Invalid public path")
        self.payoutRef = acct
            .getCapability<&AnyResource{PayoutInterfaces.Payout}>(payoutPublicPath!)
            .borrow()
            ?? panic("Could not borrow payout capability")
    }

    execute {
        let resultsMinter <- self.bet.createResultTokenMinter()

        let resultsToken <- resultsMinter.mint(outcome: outcome)

        let payoutToken <-self.bet.resolve(token: <-resultsToken)

        self.payoutRef.resolve(token: <-payoutToken)

        destroy resultsMinter
    }
}