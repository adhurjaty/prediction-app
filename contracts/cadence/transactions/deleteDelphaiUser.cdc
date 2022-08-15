import DelphaiUsers from 0xdelphai

transaction() {
    prepare(acct: AuthAccount) {
        acct.unlink(/public/DelphaiUser)
        let usr <- acct.load<@AnyResource>(from: /storage/DelphaiUser)
        destroy usr
    }
}