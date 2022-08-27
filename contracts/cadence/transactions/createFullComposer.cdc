import FUSD from 0xFUSD
import PayoutInterfaces from 0xdelphai
import WinLosePayout from 0xdelphai
import BetInterfaces from 0xdelphai
import CloserInterfaces from 0xdelphai
import AllBetsCloser from 0xdelphai
import YesNoBet from 0xdelphai
import ResolverInterfaces from 0xdelphai
import YesNoResolver from 0xdelphai
import Composer from 0xdelphai

transaction(betId: String, numMembers: Int) {

    prepare(acct: AuthAccount) {
        let betResource <- YesNoBet.create(betId: betId,
            emptyVault: <-FUSD.createEmptyVault())
        let betPathName = BetInterfaces.betPathName(betId: betId)
        let betStoragePath = StoragePath(identifier: betPathName)
            ?? panic("Invalid storage path")
        let betPrivatePath = PrivatePath(identifier: betPathName)
            ?? panic("Invalid private path")
        acct.save(<-betResource, to: betStoragePath!)
        acct.link<&AnyResource{BetInterfaces.Bet}>(
            betPrivatePath, target: betStoragePath!)
        let betRef = acct
            .getCapability<&AnyResource{BetInterfaces.Bet}>(betPrivatePath!)

        let closerResource <- AllBetsCloser.create(numMembers: numMembers)
        let closerPathName = CloserInterfaces.closerPathName(betId: betId)
        let closerStoragePath = StoragePath(identifier: closerPathName)
            ?? panic("Invalid storage path")
        let closerPrivatePath = PrivatePath(identifier: closerPathName)
            ?? panic("Invalid private path")
        acct.save(<-closerResource, to: closerStoragePath!)
        acct.link<&AnyResource{CloserInterfaces.Closer}>(
            closerPrivatePath, target: closerStoragePath!)
        let closerRef = acct
            .getCapability<&AnyResource{CloserInterfaces.Closer}>(closerPrivatePath!)

        let resolverResource <- YesNoResolver.createMajorityResolver(betId: betId, 
            numMembers: numMembers)
        let resolverPathName = ResolverInterfaces.resolverPathName(betId: betId)
        let resolverStoragePath = StoragePath(identifier: resolverPathName)
            ?? panic("Invalid storage path")
        let resolverPrivatePath = PrivatePath(identifier: resolverPathName)
            ?? panic("Invalid private path")
        acct.save(<-resolverResource, to: resolverStoragePath!)
        acct.link<&AnyResource{ResolverInterfaces.Resolver}>(
            resolverPrivatePath, target: resolverStoragePath!)
        let resolverRef = acct
            .getCapability<&AnyResource{ResolverInterfaces.Resolver}>(resolverPrivatePath!)

        let payoutResource <- WinLosePayout.create(betId: betId, 
            emptyVault: <-FUSD.createEmptyVault())
        let payoutPathName = PayoutInterfaces.payoutPathName(betId: betId)
        let payoutStoragePath = StoragePath(identifier: payoutPathName)
            ?? panic("Invalid storage path")
        let payoutPrivatePath = PrivatePath(identifier: payoutPathName)
            ?? panic("Invalid private path")
        acct.save(<-payoutResource, to: payoutStoragePath!)
        acct.link<&AnyResource{PayoutInterfaces.Payout}>(
            payoutPrivatePath, target: payoutStoragePath!)
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