import DelphaiUsers from 0xDelphaiUsers
import FungibleToken from 0xFungibleToken

pub contract YesNoBetLibrary {
    pub let yesNoBetMinterStoragePath: StoragePath

    pub event BetMadeEvent(status: String)

    pub resource YesNoBetToken: DelphaiUsers.BetToken {
        pub let betId: String
        pub let userAddress: Address
        pub var prediction: Bool?
        pub let wager: @[FungibleToken.Vault]

        init (betId: String, userAddress: Address) {
            self.betId = betId
            self.userAddress = userAddress
            self.prediction = nil
            self.wager <- []
        }

        pub fun makeBet(prediction: Bool, wager: @FungibleToken.Vault) {
            pre {
                self.wager.length == 0: "Bet has already been made"
            }
            self.prediction = prediction
            self.wager.append(<-wager)
        }

        pub fun getVault(): @FungibleToken.Vault {
            return <-self.wager.remove(at: 0)
        }

        destroy () {
            destroy self.wager
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

    pub resource YesNoBetTokenMinter {
        pub fun createToken(betId: String, address: Address): @YesNoBetToken {
            return <-create YesNoBetToken(betId: betId, userAddress: address)
        }
    }

    pub resource DummyYesNoBet {
        priv let numMembers: Int
        priv let madeBets: {Address: YesNoBetStruct}

        init (numMembers: Int) {
            self.numMembers = numMembers
            self.madeBets = {}
        }

        pub fun makeBet(bet: @YesNoBetToken): @FungibleToken.Vault {
            if bet.prediction == nil {
                panic("Must set prediction to place bet")
            }

            emit BetMadeEvent(status: "Bet made")

            let vault <- bet.getVault()
            self.madeBets[bet.userAddress] = YesNoBetStruct(
                userAddress: bet.userAddress,
                prediction: bet.prediction!,
                wager: vault.balance
            )

            destroy bet
            return <-vault
        }

        pub fun getBet(address: Address): YesNoBetStruct {
            return self.madeBets[address]
                ?? panic("Member has not made a bet")
        }
    }

    pub fun createDummyYesNoBet(numMembers: Int): @DummyYesNoBet {
        return <-create DummyYesNoBet(numMembers: numMembers)
    }

    init () {
        self.yesNoBetMinterStoragePath = /storage/YesNoBetMinter
        self.account.save(<-create YesNoBetTokenMinter(), 
            to: self.yesNoBetMinterStoragePath)
    }
}