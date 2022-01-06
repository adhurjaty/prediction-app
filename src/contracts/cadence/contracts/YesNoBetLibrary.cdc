pub contract YesNoBetLibrary {
    pub let yesNoBetMinterStoragePath: StoragePath

    pub resource YesNoBet {
        pub let betId: String
        pub let userAddress: Address
        pub var prediction: Bool?
        pub var wager: Int

        init (betId: String, userAddress: Address) {
            self.betId = betId
            self.userAddress = userAddress
            self.prediction = nil
            self.wager = 0
        }

        pub fun makeBet(prediction: Bool, wager: Int) {
            self.prediction = prediction
            self.wager = wager
        }
    }

    pub resource interface YesNoBetReceiver {
        pub fun receive(token: @YesNoBet)
    }

    pub resource YesNoBetVault: YesNoBetReceiver {
        priv var tokens: @[YesNoBet]

        init () {
            self.tokens <- []
        }

        pub fun receive(token: @YesNoBet) {
            post {
                self.tokens.length == 1 : "Token already exists in vault"
            }
            self.tokens.append(<-token)
        }

        pub fun withdraw(): @YesNoBet {
            pre {
                self.tokens.length == 1 : "No token exists in vault"
            }
            return <- self.tokens.remove(at: 0)
        }

        destroy () {
            destroy self.tokens
        }
    }

    pub resource YesNoBetBank {
        priv let betId: String
        priv let members: {Address: Bool}

        init (betId: String, members: [Address]) {
            self.betId = betId
            self.members = {}

            for member in members {
                self.members[member] = true
            }
        }

        pub fun withdrawToken(address: Address): @YesNoBet {
            if self.members[address] ?? false {
                self.members[address] = false
                return <-create YesNoBet(betId: self.betId, userAddress: address)
            }
            panic("Bet token does not exist")
        }
    }

    pub resource YesNoBetTokenMinter {
        pub fun createToken(betId: String, address: Address): @YesNoBet {
            return <-create YesNoBet(betId: betId, userAddress: address)
        }
    }

    pub fun createYesNoBetVault(): @YesNoBetVault {
        return <-create YesNoBetVault()
    }

    init () {
        self.yesNoBetMinterStoragePath = /storage/YesNoBetMinter
        self.account.save(<-create YesNoBetTokenMinter(), to: self.yesNoBetMinterStoragePath)
    }
}