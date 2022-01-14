import FUSD from 0xFUSD
import FungibleToken from 0xFungibleToken

// This transaction configures an account to store and receive tokens defined by
// the ExampleToken contract.
transaction {
    prepare(acct: AuthAccount) {
        let existingVault = acct.borrow<&FUSD.Vault>(from: /storage/fusdVault)

        if existingVault != nil {
            return
        }

        // Create a new empty Vault object
        let vaultA <- FUSD.createEmptyVault()
          
        // Store the vault in the account storage
        acct.save<@FUSD.Vault>(<-vaultA, to: /storage/fusdVault)

        // Create a public Receiver capability to the Vault
        let ReceiverRef = acct.link<&FUSD.Vault{FungibleToken.Receiver}>(
            /public/fusdReceiver, target: /storage/fusdVault)
    }

}
 