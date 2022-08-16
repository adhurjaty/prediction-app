import PayoutInterfaces from 0xdelphai

transaction() {
    prepare(acct: AuthAccount) {
        acct.save(<-PayoutInterfaces.createVault(), to: /storage/payoutTokenVault)
        acct.link<&AnyResource{PayoutInterfaces.Receiver}>(/public/payoutTokenReceiver, 
            target: /storage/payoutTokenVault)
    }
}