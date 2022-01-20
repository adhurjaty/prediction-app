import FungibleToken from 0xFungibleToken

pub contract DelphaiUsers {
    pub let claimTokenMinterStoragePath: StoragePath

    pub resource interface BetToken {
        pub let betId: String
        pub let userAddress: Address
        pub let wager: @[FungibleToken.Vault]

        pub fun getVault(): @FungibleToken.Vault {
            pre {
                self.wager.length == 1: "Bet has already been made"
            }
        }
    }

    pub resource BetTokenVault {
        priv let tokens: @{String: AnyResource{BetToken}}

        init () {
            self.tokens <- {}
        }

        pub fun deposit(token: @AnyResource{BetToken}) {
            self.tokens[token.betId] <-! token
        }

        pub fun withdraw(betId: String): @AnyResource{BetToken} {
            return <- (self.tokens.remove(key: betId)
                ?? panic("No bet token for betId: ".concat(betId)))
        }

        destroy () {
            destroy self.tokens
        }
    }

    pub resource interface ResolutionToken {
        pub let betId: String
        pub let userAddress: Address
    }

    pub resource ResolutionTokenVault {
        priv let tokens: @{String: AnyResource{ResolutionToken}}

        init () {
            self.tokens <- {}
        }

        pub fun deposit(token: @AnyResource{ResolutionToken}) {
            self.tokens[token.betId] <-! token
        }

        pub fun withdraw(betId: String): @AnyResource{ResolutionToken} {
            return <- (self.tokens.remove(key: betId)
                ?? panic("No resolution token for betId: ".concat(betId)))
        }

        destroy () {
            destroy self.tokens
        }
    }

    pub resource ClaimToken {
        pub let betId: String
        pub let userAddress: Address

        init (betId: String, userAddress: Address) {
            self.betId = betId
            self.userAddress = userAddress
        }
    }

    pub resource ClaimTokenVault {
        priv let tokens: @{String: ClaimToken}

        init () {
            self.tokens <- {}
        }

        pub fun deposit(token: @ClaimToken) {
            self.tokens[token.betId] <-! token
        }

        pub fun withdraw(betId: String): @ClaimToken {
            return <- (self.tokens.remove(key: betId)
                ?? panic("No claim token for betId: ".concat(betId)))
        }

        destroy () {
            destroy self.tokens
        }
    }

    pub resource interface TokenReceiver {
        pub fun depositBetToken(token: @AnyResource{BetToken})
        pub fun depositResolutionToken(token: @AnyResource{ResolutionToken}) 
        pub fun depositClaimToken(token: @ClaimToken)
    }

    pub resource DelphaiUser: TokenReceiver {
        pub let betTokenVault: @BetTokenVault
        pub let resolutionTokenVault: @ResolutionTokenVault
        pub let claimTokenVault: @ClaimTokenVault

        init () {
            self.betTokenVault <-create BetTokenVault()
            self.resolutionTokenVault <-create ResolutionTokenVault()
            self.claimTokenVault <-create ClaimTokenVault()
        }

        pub fun depositBetToken(token: @AnyResource{BetToken}) {
            self.betTokenVault.deposit(token: <-token)
        }

        pub fun depositResolutionToken(token: @AnyResource{ResolutionToken}) {
            self.resolutionTokenVault.deposit(token: <-token)
        }

        pub fun depositClaimToken(token: @ClaimToken) {
            self.claimTokenVault.deposit(token: <-token)
        }

        destroy () {
            destroy self.betTokenVault
            destroy self.resolutionTokenVault
            destroy self.claimTokenVault
        }
    }

    pub fun createDelphaiUser(): @DelphaiUser {
        return <-create DelphaiUser()
    }

    pub resource ClaimTokenMinter {
        pub fun createToken(betId: String, address: Address): @ClaimToken {
            return <-create ClaimToken(betId: betId, userAddress: address)
        }
    }

    init () {
        self.claimTokenMinterStoragePath = /storage/ClaimTokenMinter
        self.account.save(<-create ClaimTokenMinter(),
            to: self.claimTokenMinterStoragePath)
    }
}