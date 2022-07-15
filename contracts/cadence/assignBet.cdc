import BetContractComposer from 0xf8d6e0586b0a20c7

transaction {
    prepare(admin: AuthAccount, member: AuthAccount) {
        let adminRef = admin.borrow<&BetContractComposer.Administrator>(
            from: /storage/composerAdmin) 
            ?? panic("Could not get admin capability")

        let composerCapability = admin.borrow<&BetContractComposer.ContractComposer>(from: /storage/contractComposer)

        let bet <-composerCapability.withdrawBet()

        member.save(<-bet, /storage/yesnobet)
    }
}
