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

    pub struct WinnerStruct {
        pub let userAddress: Address
        pub let payout: UFix64

        init(userAddress: Address, payout: UFix64) {
            self.userAddress = userAddress
            self.payout = payout
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

        pub fun makeBet(bet: @AnyResource{DelphaiUsers.BetToken}): @FungibleToken.Vault {
            let token <- bet as! @YesNoBetToken

            if token.prediction == nil {
                panic("Must set prediction to place bet")
            }

            emit BetMadeEvent(status: "Bet made")

            let vault <- token.getVault()
            self.madeBets[token.userAddress] = YesNoBetStruct(
                userAddress: token.userAddress,
                prediction: token.prediction!,
                wager: vault.balance
            )

            destroy token
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

    pub resource HubAndSpokeBet {
        priv let numMembers: Int
        priv var hubBet: YesNoBetStruct?
        priv let spokeBets: {Address: YesNoBetStruct}
        priv var spokePot: UFix64

        init (numMembers: Int) {
            self.numMembers = numMembers
            self.hubBet = nil
            self.spokeBets = {}
            self.spokePot = 0.0
        }

        pub fun makeBet(bet: @AnyResource{DelphaiUsers.BetToken}): @FungibleToken.Vault {
            let token <- bet as! @YesNoBetToken
            if self.hubBet != nil && self.hubBet!.prediction == token.prediction {
                panic("Must bet differently from the first bet")
            }

            if token.prediction == nil {
                panic("Must set prediction to place bet")
            }

            emit BetMadeEvent(status: "Bet made")

            let vault <- token.getVault()
            if self.hubBet != nil && (self.spokePot + vault.balance > self.hubBet!.wager) {
                panic("Bet is too large")
            }

            if self.hubBet == nil {
                self.hubBet = YesNoBetStruct(
                    userAddress: token.userAddress,
                    prediction: token.prediction!,
                    wager: vault.balance
                )
            } else {
                self.spokeBets[token.userAddress] = YesNoBetStruct(
                    userAddress: token.userAddress,
                    prediction: token.prediction!,
                    wager: vault.balance
                )
                self.spokePot = self.spokePot + vault.balance
            }

            destroy token
            return <-vault
        }

        pub fun getBet(address: Address): YesNoBetStruct {
            pre {
                self.hubBet != nil : "No bets have been made"
            }
            if address == self.hubBet!.userAddress {
                return self.hubBet!
            }
            return self.spokeBets[address]
                ?? panic("Member has not made a bet")
        }

        pub fun getWinners(resolution: Bool): [WinnerStruct] {
            pre {
                self.hubBet != nil : "No bets have been made"
            }

            let winners: [WinnerStruct] = []

            if self.hubBet!.prediction == resolution {
                winners.append(WinnerStruct(
                    userAddress: self.hubBet!.userAddress,
                    payout: self.spokePot + self.hubBet!.wager
                ))
                return winners
            }

            for spoke in self.spokeBets.values {
                winners.append(WinnerStruct(
                    userAddress: spoke.userAddress,
                    payout: spoke.wager * 2.0
                ))
            }
            
            return winners
        }
    }

    init () {
        self.yesNoBetMinterStoragePath = /storage/YesNoBetMinter
        self.account.save(<-create YesNoBetTokenMinter(), 
            to: self.yesNoBetMinterStoragePath)
    }
}