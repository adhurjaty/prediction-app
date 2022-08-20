import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import PayoutInterfaces from 0xdelphai
import WinLosePayout from 0xdelphai
import BetInterfaces from 0xdelphai
import YesNoBet from 0xdelphai

transaction(betId: String) {

    prepare(acct: AuthAccount) {
        let payoutPathName = PayoutInterfaces.payoutPathName(betId: betId)
        let payoutStoragePath = StoragePath(identifier: payoutPathName)
            ?? panic("Invalid storage path")

        let payoutRef = acct.borrow<&WinLosePayout.Payout>(from: payoutStoragePath)
            ?? panic("Could not borrow payout reference")

        let payoutTokenMinter <- payoutRef.createBetTokenMinter()

        let betResource <- YesNoBet.create(betId: betId,
            payoutTokenMinter: <-payoutTokenMinter,
            emptyVault: <-FlowToken.createEmptyVault())
        
        let pathName = BetInterfaces.betPathName(betId: betId)
        let betStoragePath = StoragePath(identifier: pathName)
            ?? panic("Invalid storage path")
        let betPublicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")

        acct.save(<-betResource, to: betStoragePath!)
        acct.link<&AnyResource{BetInterfaces.Bet}>(
            betPublicPath, target: betStoragePath!)
    }
}