import FUSD from 0xFUSD
import FungibleToken from 0xFungibleToken

transaction(receiverAddress: Address, amount: UFix64) {
    // Temporary Vault object that holds the balance that is being transferred
    var temporaryVault: @FUSD.Vault

    prepare(acct: AuthAccount) {
        // withdraw tokens from your vault by borrowing a reference to it
        // and calling the withdraw function with that reference
        let vaultRef = acct.borrow<&FungibleToken.Vault>(from: /storage/fusdVault)
            ?? panic("Could not borrow a reference to the owner's vault")

        self.temporaryVault <- vaultRef.withdraw(amount: amount) as! @FUSD.Vault
    }

    execute {
        // get the recipient's public account object
        let recipient = getAccount(receiverAddress)

        // get the recipient's Receiver reference to their Vault
        // by borrowing the reference from the public capability
        let receiverRef = recipient.getCapability(/public/fusdReceiver)
                        .borrow<&FUSD.Vault{FungibleToken.Receiver}>()
                        ?? panic("Could not borrow a reference to the receiver")

        // deposit your tokens to their Vault
        receiverRef.deposit(from: <-self.temporaryVault)

        log("Transfer succeeded!")
    }
}