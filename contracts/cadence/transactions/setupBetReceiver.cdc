import BetInterfaces from 0xdelphai

transaction() {
    prepare(acct: AuthAccount) {
        acct.save(<-BetInterfaces.createVault(), to: /storage/betTokenVault)
        acct.link<&AnyResource{BetInterfaces.Receiver}>(/public/betTokenReceiver, 
            target: /storage/betTokenVault)
    }
}