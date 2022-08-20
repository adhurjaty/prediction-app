import DelphaiResources from 0xdelphai

transaction() {
    prepare(acct: AuthAccount) {
        acct.save(<-DelphaiResources.createUser(), to: /storage/delphaiUser)
    }
}