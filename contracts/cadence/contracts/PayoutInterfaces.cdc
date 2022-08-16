import FungibleToken from "./FungibleToken.cdc"

pub contract PayoutInterfaces {
    pub resource Token {
        pub let betId: String
        pub let address: Address

        init(betId: String, address: Address) {
            self.betId = betId
            self.address = address
        }
    }

    pub resource interface ResultsToken {
        pub let betId: String
    }

    pub resource interface Payout {
        pub let betId: String
        pub var balance: UFix64

        pub fun deposit(from: @FungibleToken.Vault) {
            pre {
                from.balance > 0.0: "Vault balance must be greater than 0.0"
            }
            post {
                self.balance == before(self.balance) + before(from.balance): "Balance must be increased by the deposited amount"
            }
        }

        pub fun resolve(token: @AnyResource{ResultsToken}) {
            pre {
                token.betId == self.betId: "Token betId must match Payout betId"
            }
        }

        pub fun withdraw(token: @Token): @FungibleToken.Vault {
            pre {
                self.balance >= 0.0: "Balance must be greater than or equal to 0.0"
            }
            post {
                self.balance == before(self.balance) - result.balance: "Balance must be decreased by the withdrawn amount"
            }
        }
    }

    pub resource TokenMinter {
        pub fun mint(betId: String, address: Address): @Token {
            return <-create Token(betId: betId, address: address)
        }
    }

    pub resource interface Receiver {
        pub fun deposit(token: @Token)
    }

    pub resource Vault: Receiver {
        priv let tokens: @{String: Token}

        init () {
            self.tokens <- {}
        }

        pub fun deposit(token: @Token) {
            self.tokens[token.betId] <-! token
        }

        pub fun withdraw(betId: String): @Token {
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

    pub let TokenMinterStoragePath: StoragePath
    init () {
        self.TokenMinterStoragePath = /storage/PayoutTokenMinter
        self.account.save(<-create TokenMinter(), to: self.TokenMinterStoragePath)
    }
}