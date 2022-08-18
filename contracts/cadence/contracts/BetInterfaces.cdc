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
}