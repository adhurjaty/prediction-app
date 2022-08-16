import PayoutInterfaces from 0xdelphai

transaction() {
    prepare(acct: AuthAccount) {
        acct.save(<-PayoutInterfaces.createReceiver(), to: /storage/payoutTokenReceiver)
        acct.link<&AnyResource{PayoutInterfaces.Receiver}>(/public/payoutTokenReceiver, 
            target: /storage/payoutTokenReceiver)
    }
}