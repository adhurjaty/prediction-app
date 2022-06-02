import FlowToken from 0xFlowToken
import FungibleToken from 0xFungibleToken

// This transaction configures an account to store and receive tokens defined by
// the ExampleToken contract.
transaction {
    prepare(acct: AuthAccount) {
        let existingVault = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)

        if existingVault != nil {
            return
        }

        // Create a new empty Vault object
        let vaultA <- FlowToken.createEmptyVault()
          
        // Store the vault in the account storage
        acct.save<@FlowToken.Vault>(<-(vaultA as! @FlowToken.Vault), to: /storage/flowTokenVault)

        // Create a public Receiver capability to the Vault
        let ReceiverRef = acct.link<&FlowToken.Vault{FungibleToken.Receiver}>(
            /public/flowTokenReceiver, target: /storage/flowTokenVault)
    }

}
 