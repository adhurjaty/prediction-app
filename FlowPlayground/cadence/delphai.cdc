pub contract Delphai {
    pub fun createGroup(payer: AuthAccount, members: [PublicAccount]): AuthAccount {
        let sharedAccount = AuthAccount(payer: payer)
        for member in members {
            sharedAccount.addPublicKey(member.keys.get(keyIndex: 0)!.publicKey.publicKey)
        }
        return sharedAccount
    }

}
 