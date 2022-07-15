// import FungibleToken from 0xFungibleToken
// import FUSD from 0xFUSD
// import FUSD from 0xf8d6e0586b0a20c7
import FlowToken from 0xFlowToken

transaction() {
    prepare(acct: AuthAccount) {    
        let vaultRef = acct
            .borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
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