import DelphaiResources from "./DelphaiResources.cdc"
import BetInterfaces from "./BetInterfaces.cdc"

pub contract ResolverInterfaces {
    pub struct interface State {
        pub var isResolved: Bool
    }

    pub resource interface Token {
        pub let betId: String
        pub let address: Address
    }

    pub resource interface MintResults {
        pub fun getDelphaiToken(): @DelphaiResources.Token
        pub fun getToken(): @AnyResource{Token}
    }

    pub resource interface Resolver {
        pub let betId: String
        pub let state: AnyStruct{State}

        pub fun mintToken(token: @DelphaiResources.Token): @AnyResource{MintResults} {
            pre {
                self.betId == token.betId: "Bet ID mismatch"
            }
        }

        pub fun vote(token: @AnyResource{Token}) {
            pre {
                token.betId == self.betId: "Token does not belong to this bet"
            }
        }

        pub fun resolve(): AnyStruct{BetInterfaces.Result}?
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

    pub fun resolverPathName(betId: String): String {
        return "Resolver_".concat(betId)
    }
}