import BetInterfaces from 0xdelphai

transaction() {
    prepare(acct: AuthAccount) {
        acct.save(<-BetInterfaces.createVault(), to: /storage/delphaiBetTokenVault)
        acct.link<&AnyResource{BetInterfaces.Receiver}>(/public/delphaiBetTokenReceiver, 
            target: /storage/delphaiBetTokenVault)
    }
}