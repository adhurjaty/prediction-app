contract DelhaiUsers {
    pub resource interface BetToken {
        pub let betId: String
        pub let userAddress: Address
    }

    pub resource BetTokenVault {
        priv let tokens: @{String: AnyResource{BetToken}}

        init () {
            self.tokens <- {}
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
    }

    pub resource DelpahiUser {
        pub let betTokenVault: @BetTokenVault
        pub let resolutionTokenVault: @ResolutionTokenVault

        init () {
            self.betTokenVault <-create BetTokenVault()
            self.resolutionTokenVault <-create ResolutionTokenVault()
        }
    }
}