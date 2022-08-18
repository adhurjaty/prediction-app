import PayoutInterfaces from "./PayoutInterfaces.cdc"
import FungibleToken from "./FungibleToken.cdc"

pub contract BetInterfaces {

    pub resource interface Token {
        pub let betId: String
        pub let address: Address
        pub let wager: @FungibleToken.Vault
    }

    pub resource interface Result {
        pub let betId: String
    }    

    pub resource interface Bet {
        pub let betId: String

        pub fun placeBet(token: @AnyResource{Token}): @FungibleToken.Vault {
            pre {
                token.betId == self.betId: "Bet ID does not match"
                token.wager.balance > 0.0: "Wager must be greater than 0"
            }
        }

        pub fun resolve(token: @AnyResource{Result}): @AnyResource{PayoutInterfaces.ResultsToken} {
            pre {
                token.betId == self.betId: "Bet ID does not match"
            }
        }
    }

    pub resource interface TokenMinter {
        pub fun mintToken(address: Address): @AnyResource{Token}
    }

    pub resource interface Receiver {
        pub fun deposit(token: @AnyResource{Token})
    }

    pub resource Vault: Receiver {
        priv let tokens: @{String: AnyResource{Token}}

        init () {
            self.tokens <- {}
        }

        pub fun deposit(token: @AnyResource{Token}) {
            self.tokens[token.betId] <-! token
        }

        pub fun withdraw(betId: String): @AnyResource{Token} {
            return <- (self.tokens.remove(key: betId)
                ?? panic("No token with betId ".concat(betId)))
        }

        destroy () {
            destroy self.tokens
        }
    }

    pub fun createVault(): @Vault {
        return <-create Vault()
    }

    pub fun betPathName(betId: String): String {
        return "Bet_".concat(betId)
    }
}