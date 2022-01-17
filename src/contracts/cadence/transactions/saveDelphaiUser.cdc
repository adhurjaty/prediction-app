import DelphaiUsers from 0xdelphai

transaction() {
    prepare(acct: AuthAccount) {
        acct.save(<-DelphaiUsers.createDelphaiUser(), to: /storage/DelphaiUser)
        acct.link<&AnyResource{DelphaiUsers.TokenReceiver}>(
            /public/DelphaiUser, target: /storage/DelphaiUser)
    }
}