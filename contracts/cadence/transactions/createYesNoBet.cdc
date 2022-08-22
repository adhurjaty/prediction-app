import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import PayoutInterfaces from 0xdelphai
import WinLosePayout from 0xdelphai
import BetInterfaces from 0xdelphai
import YesNoBet from 0xdelphai

transaction(betId: String) {

    prepare(acct: AuthAccount) {
        let betResource <- YesNoBet.create(betId: betId,
            emptyVault: <-FlowToken.createEmptyVault())
        
        let pathName = BetInterfaces.betPathName(betId: betId)
        let betStoragePath = StoragePath(identifier: pathName)
            ?? panic("Invalid storage path")
        let betPrivatePath = PrivatePath(identifier: pathName)
            ?? panic("Invalid private path")

        acct.save(<-betResource, to: betStoragePath!)
        acct.link<&AnyResource{BetInterfaces.Bet}>(
            betPrivatePath, target: betStoragePath!)
    }
}