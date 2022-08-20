import PayoutInterfaces from 0xdelphai

transaction() {
    prepare(acct: AuthAccount) {
        acct.save(<-PayoutInterfaces.createVault(), to: /storage/delphaiPayoutTokenVault)
        acct.link<&AnyResource{PayoutInterfaces.Receiver}>(/public/delphaiPayoutTokenReceiver, 
            target: /storage/delphaiPayoutTokenVault)
    }
}