// import ExampleToken from 0x1
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
// import FUSD from 0x1

transaction() {
    prepare(acct: AuthAccount) {    
        let vaultRef = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow a reference to the owner's vault")

        // let tokenReceiver = acct
        //     .getCapability(/public/flowTokenReceiver)!
        //     .borrow<&{FungibleToken.Receiver}>()
        //     ?? panic("Unable to borrow receiver reference")

        log("Hello")
        log(acct.balance)
        log(vaultRef.balance)
    }
}