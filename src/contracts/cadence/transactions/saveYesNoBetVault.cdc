import YesNoBetLibrary from 0xdelphai

transaction() {
    prepare(acct: AuthAccount) {
        acct.save(<-YesNoBetLibrary.createYesNoBetVault(), to: /storage/YesNoBetVault)
        acct.link<&AnyResource{YesNoBetLibrary.YesNoBetReceiver}>(
            /public/YesNoBetVault, target: /storage/YesNoBetVault)
    }
}