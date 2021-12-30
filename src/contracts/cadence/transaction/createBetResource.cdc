import BetContractComposer from 0xdelphai

transaction(betId: String, members: [Address]) {
    prepare(admin: AuthAccount) {
        let adminRef = admin.borrow<&BetContractComposer.Administrator>(
            from: BetContractComposer.adminStoragePath) 
            ?? panic("Could not get admin capability")

        admin.deployContractComposer(betId: betId, admin: admin, members: members)
    }
}
