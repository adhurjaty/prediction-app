import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import PayoutInterfaces from 0xdelphai
import WinLosePayout from 0xdelphai
import BetInterfaces from 0xdelphai
import CloserInterfaces from 0xdelphai
import YesNoBet from 0xdelphai
import ResolverInterfaces from 0xdelphai
import YesNoResolver from 0xdelphai
import Composer from 0xdelphai

transaction(betId: String) {

    prepare(acct: AuthAccount) {
        let betPathName = BetInterfaces.betPathName(betId: betId)
        let betPrivatePath = PrivatePath(identifier: betPathName)
            ?? panic("Invalid private path")
        let betRef = acct
            .getCapability<&AnyResource{BetInterfaces.Bet}>(betPrivatePath!)

        let closerPathName = CloserInterfaces.closerPathName(betId: betId)
        let closerPrivatePath = PrivatePath(identifier: closerPathName)
            ?? panic("Invalid private path")
        let closerRef = acct
            .getCapability<&AnyResource{CloserInterfaces.Closer}>(closerPrivatePath!)

        let resolverPathName = ResolverInterfaces.resolverPathName(betId: betId)
        let resolverPrivatePath = PrivatePath(identifier: resolverPathName)
            ?? panic("Invalid private path")
        let resolverRef = acct
            .getCapability<&AnyResource{ResolverInterfaces.Resolver}>(resolverPrivatePath!)

        let payoutPathName = PayoutInterfaces.payoutPathName(betId: betId)
        let payoutPrivatePath = PrivatePath(identifier: payoutPathName)
            ?? panic("Invalid private path")
        let payoutRef = acct
            .getCapability<&AnyResource{PayoutInterfaces.Payout}>(payoutPrivatePath!)

        let composer <-Composer.create(betRef: betRef!, closerRef: closerRef!,
            resolverRef: resolverRef!, payoutRef: payoutRef!)
        
        let composerPathName = Composer.composerPathName(betId: betId)
        let composerStoragePath = StoragePath(identifier: composerPathName)
            ?? panic("Invalid storage path")
        let composerPublicPath = PublicPath(identifier: composerPathName)
            ?? panic("Invalid public path")

        acct.save(<-composer, to: composerStoragePath!)
        acct.link<&AnyResource{Composer.PublicComposer}>(
            composerPublicPath, target: composerStoragePath!)
    }
}