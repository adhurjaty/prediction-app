import BetInterfaces from 0xdelphai
import YesNoBet from 0xdelphai

transaction(betId: String, outcome: Bool?) {
    let bet: &YesNoBet.Bet
    
    prepare(acct: AuthAccount) {
        let pathName = BetInterfaces.betPathName(betId: betId)
        let betStoragePath = StoragePath(identifier: pathName)
            ?? panic("Invalid storage path")
        self.bet = acct.borrow<&YesNoBet.Bet>(from: betStoragePath!) 
            ?? panic("Could not borrow bet")
    }

    execute {
        let resultsMinter <- self.bet.createResultTokenMinter()

        let resultsToken <- resultsMinter.mint(outcome: outcome)

        let payoutToken <-self.bet.resolve(token: <-resultsToken)

        destroy resultsMinter
    }
}