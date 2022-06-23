import FUSD from 0xFUSD

transaction {
    prepare(acct: AuthAccount) {
        let admin <- acct.load<@FUSD.Administrator>(from: /storage/fusdAdmin)
            ?? panic("Failed to get FUSD admin resource")

        let minter <- admin.createNewMinter()
        let newVault <- minter.mintTokens(amount: 999999.9)

        let vaultRef = acct.borrow<&FUSD.Vault>(from: /storage/fusdVault)
            ?? panic("Could not get FUSD Token vault reference")

        vaultRef.deposit(from: <-newVault)

        destroy minter

        acct.save(<- admin, to: /storage/fusdAdmin)
    }
}