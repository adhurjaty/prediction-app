import FungibleToken from 0xFungibleToken

pub contract DelphaiUsers {
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

    pub resource interface TokenReceiver {
        pub fun depositBetToken(token: @AnyResource{BetToken})
        pub fun depositResolutionToken(token: @AnyResource{ResolutionToken}) 
    }

    pub resource DelphaiUser: TokenReceiver {
        pub let betTokenVault: @BetTokenVault
        pub let resolutionTokenVault: @ResolutionTokenVault

        init () {
            self.betTokenVault <-create BetTokenVault()
            self.resolutionTokenVault <-create ResolutionTokenVault()
        }

        pub fun depositBetToken(token: @AnyResource{BetToken}) {
            self.betTokenVault.deposit(token: <-token)
        }

        pub fun depositResolutionToken(token: @AnyResource{ResolutionToken}) {
            self.resolutionTokenVault.deposit(token: <-token)
        }

        destroy () {
            destroy self.betTokenVault
            destroy self.resolutionTokenVault
        }
    }

    pub fun createDelphaiUser(): @DelphaiUser {
        return <-create DelphaiUser()
    }
}