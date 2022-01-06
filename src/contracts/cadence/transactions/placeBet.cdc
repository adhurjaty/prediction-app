import BetContractComposer from 0xdelphai

transaction(betId: String, prediction: Bool, wager: Int) {
    prepare(admin: AuthAccount, member: AuthAccount) {
        let adminRef = admin.borrow<&BetContractComposer.Administrator>(
            from: BetContractComposer.adminStoragePath) 
            ?? panic("Could not get admin capability")
        
        let yesNoToken <-adminRef.withdrawBetToken(betId: betId, admin: admin, member: member.address)
        yesNoToken.makeBet(prediction: prediction, wager: wager)

        let composerCapability = admin.borrow<&BetContractComposer.ContractComposer>(
            from: BetContractComposer.getDeploymentStoragePath(betId: betId))
            ?? panic("Could not get contract resource")
        
        composerCapability.makeBet(acct: member, bet: <-yesNoToken)
    }
}
