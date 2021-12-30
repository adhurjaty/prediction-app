import BetContractComposer from 0xdelphai

transaction(betId: String) {
    prepare(admin: AuthAccount, member: AuthAccount) {
        let adminRef = admin.borrow<&BetContractComposer.Administrator>(
            from: BetContractComposer.adminStoragePath) 
            ?? panic("Could not get admin capability")
        
        let publicPath = BetContractComposer.getPublicPath(id: betId)
        
    }
}
