import FlowToken from 0xFlowToken
import BetInterfaces from 0xdelphai
import YesNoBet from 0xdelphai
import Composer from 0xdelphai

transaction(delphai: Address, betId: String, bet: Bool, wager: UFix64) {
    let flowVault: &FlowToken.Vault 
    let tokenVault: &BetInterfaces.Vault

    prepare(acct: AuthAccount) {
        self.flowVault = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow FlowToken.Vault from storage")
        self.tokenVault = acct.borrow<&BetInterfaces.Vault>(from: /storage/delphaiBetTokenVault)
            ?? panic("Could not borrow BetInterfaces.Vault from storage")
    }

    execute {
        let token <- self.tokenVault.withdraw(betId: betId)

        let yesNoToken <- token as! @YesNoBet.UserToken

        yesNoToken.makeWager(bet: bet, wager: <-self.flowVault.withdraw(amount: wager))

        let pathName = Composer.composerPathName(betId: betId)
        let publicPath = PublicPath(identifier: pathName)
            ?? panic("Invalid public path")
        let composer = getAccount(delphai)
            .getCapability<&AnyResource{Composer.PublicComposer}>(publicPath!)
            .borrow()
            ?? panic("Could not borrow composer capability")

        composer.placeWager(token: <-yesNoToken)
    }
}