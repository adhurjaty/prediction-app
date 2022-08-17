import PayoutInterfaces from 0xdelphai
import WinLosePayout from 0xdelphai
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken

transaction(betId: String) {

    prepare(acct: AuthAccount) {
        let payoutResource <- WinLosePayout.create(betId: betId, 
            emptyVault: <-FlowToken.createEmptyVault())
        
        let pathName = PayoutInterfaces.payoutPathName(betId: betId)
        let payoutStoragePath = StoragePath(identifier: pathName)
            ?? panic("Invalid storage path")
        let payoutPrivatePath = PrivatePath(identifier: pathName)
            ?? panic("Invalid private path")
        let payoutPublicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")

        acct.save(<-payoutResource, to: payoutStoragePath!)
        acct.link<&AnyResource{PayoutInterfaces.TokenMinter}>(
            payoutPrivatePath, target: payoutStoragePath!)
        acct.link<&AnyResource{PayoutInterfaces.Payout}>(
            payoutPublicPath, target: payoutStoragePath!)
    }
}