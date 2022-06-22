import BetContractComposer from 0xdelphai
import YesNoBetLibrary from 0xdelphai

pub fun main(delphai: Address, betId: String): BetContractComposer.ComposerState {
    let path = PublicPath(identifier: betId)
    let composerRef = getAccount(delphai)
        .getCapability<&BetContractComposer.ContractComposer>(path!)
        .borrow()
        ?? panic("Could not get bet composer")
    return composerRef.getState()
}