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

        destroy () {
            destroy self.tokens
        }
    }

    pub resource DelpahiUser {
        pub let betTokenVault: @BetTokenVault
        pub let resolutionTokenVault: @ResolutionTokenVault

        init () {
            self.betTokenVault <-create BetTokenVault()
            self.resolutionTokenVault <-create ResolutionTokenVault()
        }

        destroy () {
            destroy self.betTokenVault
            destroy self.resolutionTokenVault
        }
    }
}