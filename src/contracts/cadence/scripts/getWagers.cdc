import BetContractComposer from 0xdelphai
import YesNoBetLibrary from 0xdelphai

pub fun main(delphai: Address, betId: String): [YesNoBetLibrary.YesNoBetStruct] {
    execute {
        let composerRef = getAccount(delphai)
            .getCapability<&BetContractComposer.ContractComposer>(
                /public/betId1234)!
            .borrow()
            ?? panic("Could not get bet composer")
        return composerRef.getWagers()
    }
}