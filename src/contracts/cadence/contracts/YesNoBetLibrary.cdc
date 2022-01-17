import FungibleToken from 0xFungibleToken

pub contract YesNoBetLibrary {
    pub let yesNoBetMinterStoragePath: StoragePath
    pub let yesNoBetBankRepoStoragePath: StoragePath

    pub event BetMadeEvent(status: String)

    pub resource YesNoBet {
        pub let betId: String
        pub let userAddress: Address
        pub var prediction: Bool?
        pub var wager: UFix64

        init (betId: String, userAddress: Address) {
            self.betId = betId
            self.userAddress = userAddress
            self.prediction = nil
            self.wager = 0.0
        }

        pub fun makeBet(prediction: Bool, wager: @FungibleToken.Vault) {
            self.prediction = prediction
            self.wager = wager.balance
            destroy wager
        }
    }

    pub struct YesNoBetStruct {
        pub let userAddress: Address
        pub let prediction: Bool
        pub let wager: UFix64

        init (userAddress: Address, prediction: Bool, wager: UFix64) {
            self.userAddress = userAddress
            self.prediction = prediction
            self.wager = wager
        }
    }

    pub resource interface YesNoBetReceiver {
        pub fun receive(token: @YesNoBet)
    }

    pub resource BetTokenVault: YesNoBetReceiver {
        priv var tokens: @{String: AnyResource{BetToken}}

        init () {
            self.tokens <- []
        }

        pub fun receive(token: @YesNoBet) {
            post {
                self.tokens.length == 1 : "Token already exists in vault"
            }
            self.tokens[token.betId] <-token
        }

        pub fun withdraw(betId: String): @YesNoBet {
            pre {
                self.tokens.length == 1 : "No token exists in vault"
            }
            return <-! self.tokens[betId]
        }

        destroy () {
            destroy self.tokens
        }
    }

    pub struct YesNoBetBank {
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

    pub resource YesNoBetBankRepo {
        priv let bankMap: {String: YesNoBetBank}

        init () {
            self.bankMap = {}
        }

        pub fun cacheTokens(betId: String, members: [Address]) {
            self.bankMap[betId] = YesNoBetBank(betId: betId, members: members)
        }

        pub fun withdrawToken(betId: String, address: Address): @YesNoBet {
            let bank = self.bankMap[betId] 
                ?? panic("Bet ID does not exist")
            let token <-bank.withdrawToken(address: address) 
            return <-token
        }
    }

    pub resource YesNoBetTokenMinter {
        pub fun createToken(betId: String, address: Address): @YesNoBet {
            return <-create YesNoBet(betId: betId, userAddress: address)
        }
    }

    pub resource DummyYesNoBet {
        priv let numMembers: Int
        priv let madeBets: {Address: YesNoBetStruct}

        init (numMembers: Int) {
            self.numMembers = numMembers
            self.madeBets = {}
        }

        pub fun makeBet(bet: @YesNoBet): @YesNoBet {
            if bet.prediction == nil {
                panic("Must set prediction to place bet")
            }

            emit BetMadeEvent(status: "Bet made")

            self.madeBets[bet.userAddress] = YesNoBetStruct(
                userAddress: bet.userAddress,
                prediction: bet.prediction!,
                wager: bet.wager
            )
            return <-bet
        }

        pub fun getBet(address: Address): YesNoBetStruct {
            return self.madeBets[address]
                ?? panic("Member has not made a bet")
        }
    }

    pub fun createYesNoBetVault(): @YesNoBetVault {
        return <-create YesNoBetVault()
    }

    pub fun createDummyYesNoBet(numMembers: Int): @DummyYesNoBet {
        return <-create DummyYesNoBet(numMembers: numMembers)
    }

    init () {
        self.yesNoBetMinterStoragePath = /storage/YesNoBetMinter
        self.yesNoBetBankRepoStoragePath = /storage/YesNoBetBankRepo
        self.account.save(<-create YesNoBetTokenMinter(), 
            to: self.yesNoBetMinterStoragePath)
        self.account.save(<-create YesNoBetBankRepo(), 
            to: self.yesNoBetBankRepoStoragePath)
    }
}