import DelphaiResources from 0xdelphai
import BetInterfaces from 0xdelphai
import ResolverInterfaces from 0xdelphai
import PayoutInterfaces from 0xdelphai

transaction() {
    prepare(acct: AuthAccount) {
        acct.save(<-DelphaiResources.createUser(), to: /storage/delphaiUser)

        acct.save(<-BetInterfaces.createVault(), to: /storage/delphaiBetTokenVault)
        acct.link<&AnyResource{BetInterfaces.Receiver}>(/public/delphaiBetTokenReceiver, 
            target: /storage/delphaiBetTokenVault)

        acct.save(<-ResolverInterfaces.createVault(), to: /storage/delphaiResolverTokenVault)
        acct.link<&AnyResource{ResolverInterfaces.Receiver}>(/public/delphaiResolverTokenReceiver, 
            target: /storage/delphaiResolverTokenVault)

        acct.save(<-PayoutInterfaces.createVault(), to: /storage/delphaiPayoutTokenVault)
        acct.link<&AnyResource{PayoutInterfaces.Receiver}>(/public/delphaiPayoutTokenReceiver, 
            target: /storage/delphaiPayoutTokenVault)
    }
}