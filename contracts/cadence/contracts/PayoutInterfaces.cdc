import FungibleToken from "./FungibleToken.cdc"
import DelphaiResources from "./DelphaiResources.cdc"

pub contract PayoutInterfaces {
    pub struct UserPayout {
        pub let address: Address
        pub let amount: UFix64
        pub let hasRetrieved: Bool

        init(address: Address, amount: UFix64, hasRetrieved: Bool) {
            self.address = address
            self.amount = amount
            self.hasRetrieved = hasRetrieved
        }
    }

    pub struct State {
        pub let isResolved: Bool
        pub let payouts: {String: UserPayout}

        init(isResolved: Bool, payouts: [UserPayout]) {
            self.isResolved = isResolved
            self.payouts = {}
            for payout in payouts {
                self.payouts[payout.address.toString()] = payout
            }
        }

        pub fun setRetrieved(address: Address) {
            if let payout = self.payouts[address.toString()] {
                self.payouts[address.toString()] = UserPayout(
                    address: payout.address,
                    amount: payout.amount,
                    hasRetrieved: true
                )
            } else {
                panic("No payout for address")
            }
        }
    }

    pub resource interface Token {
        pub let betId: String
        pub let address: Address
    }

    pub struct interface Results {
    }

    pub resource interface MintResults {
        pub fun getDelphaiToken(): @DelphaiResources.Token
        pub fun getToken(): @AnyResource{Token}
    }

    pub resource interface Payout {
        pub let betId: String
        pub var balance: UFix64
        pub var state: State

        pub fun mintToken(token: @DelphaiResources.Token): @AnyResource{MintResults} {
            pre {
                token.betId == self.betId: "Token betId does not match payout betId"
            }
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            pre {
                from.balance > 0.0: "Vault balance must be greater than 0.0"
            }
            post {
                self.balance == before(self.balance) + before(from.balance): "Balance must be increased by the deposited amount"
            }
        }

        pub fun resolve(results: AnyStruct{Results})

        pub fun withdraw(token: @AnyResource{Token}): @FungibleToken.Vault {
            pre {
                self.balance >= 0.0: "Balance must be greater than or equal to 0.0"
            }
            post {
                self.balance == before(self.balance) - result.balance: "Balance must be decreased by the withdrawn amount"
            }
        }
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

    pub fun payoutPathName(betId: String): String {
        return "Payout_".concat(betId)
    }
}