import BetContractComposer from 0xdelphai
import YesNoResolverLibrary from 0xdelphai

pub fun main(delphai: Address, betId: String): YesNoResolverLibrary.YesNoResolutionResults {
    let composerRef = getAccount(delphai)
        .getCapability<&BetContractComposer.ContractComposer>(
            /public/betId1234)!
        .borrow()
        ?? panic("Could not get bet composer")
    return composerRef.getResolutionResults()
}