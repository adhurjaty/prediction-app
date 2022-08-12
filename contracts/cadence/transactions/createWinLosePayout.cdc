import PayoutInterfaces from 0xdelphai
import WinLosePayout from 0xdelphai
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken

transaction(betId: String) {

    prepare(acct: AuthAccount) {
        let payoutTokenMinter = acct.borrow<&PayoutInterfaces.TokenMinter>(from: PayoutInterfaces.TokenMinterStoragePath)
            ?? panic("Could not borrow payout token minter")
        let resultsTokenMinterMinter = acct.borrow<&WinLosePayout.BetResultsTokenMinterMinter>(from: WinLosePayout.BetResultsMinterMinterStoragePath)
            ?? panic("Could not borrow bet results token minter minter")
        
        let payoutResource <- WinLosePayout.create(betId: betId, 
            emptyVault: <-FlowToken.createEmptyVault())
        
        let pathName = "WinLosePayout_".concat(betId)
        let payoutStoragePath = StoragePath(identifier: pathName)
            ?? panic("Invalid storage path")
        let payoutPublicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")

        acct.save(<-payoutResource, to: payoutStoragePath!)
        acct.link<&AnyResource{PayoutInterfaces.Payout}>(
            payoutPublicPath, target: payoutStoragePath!)
    }
}