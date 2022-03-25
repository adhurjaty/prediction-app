import DelphaiUsers from "./DelphaiUsers.cdc"
import FungibleToken from "./FungibleToken.cdc"

pub contract YesNoBetLibrary {
    pub let yesNoBetMinterStoragePath: StoragePath

    pub event BetMadeEvent(status: String)

    pub resource YesNoBetToken: DelphaiUsers.BetToken {
        pub let betId: String
        pub let userAddress: Address
        pub var prediction: Bool?
        pub let wager: @[FungibleToken.Vault]
        priv var wagerBalance: UFix64

        init (betId: String, userAddress: Address) {
            self.betId = betId
            self.userAddress = userAddress
            self.prediction = nil
            self.wager <- []
            self.wagerBalance = 0.0
        }

        pub fun makeBet(prediction: Bool, wager: @FungibleToken.Vault) {
            pre {
                self.wager.length == 0: "Bet has already been made"
            }
            self.prediction = prediction
            self.wagerBalance = wager.balance
            self.wager.append(<-wager)
        }

        pub fun getVault(): @FungibleToken.Vault {
            pre {
                self.wager.length == 1 : "Bet has not been made"
            }
            return <-self.wager.remove(at: 0)
        }

        pub fun getVaultBalance(): UFix64 {
            return self.wagerBalance
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

    pub struct HubBet {
        pub let address: Address
        pub let prediction: Bool
        pub let wager: UFix64

        init (address: Address, prediction: Bool, wager: UFix64) {
            self.address = address
            self.prediction = prediction
            self.wager = wager
        }
    }

    pub resource HubAndSpokeBet {
        priv let numMembers: Int
        priv var hubBet: HubBet?
        priv let madeBets: @{Address: YesNoBetToken}
        priv var spokeBalance: UFix64
        priv var isResolved: Bool

        init (numMembers: Int) {
            self.numMembers = numMembers
            self.hubBet = nil
            self.madeBets <- {}
            self.spokeBalance = 0.0
            self.isResolved = false
        }

        pub fun makeBet(bet: @AnyResource{DelphaiUsers.BetToken}) {
            let token <- bet as! @YesNoBetToken
            if self.hubBet != nil && self.hubBet!.prediction == token.prediction {
                panic("Must bet differently from the first bet")
            }

            if token.prediction == nil {
                panic("Must set prediction to place bet")
            }

            if self.hubBet != nil {
                let vault <- token.getVault()
                let emptyVault <- vault.withdraw(amount: 0.0)
                self.assertSameTokenType(emptyVault: <-emptyVault)
                token.makeBet(prediction: token.prediction!, wager: <-vault)
            }

            emit BetMadeEvent(status: "Bet made")

            let vault <- token.getVault()
            if self.hubBet != nil && (self.spokeBalance + vault.balance > self.hubBet!.wager) {
                panic("Bet is too large")
            }

            if self.hubBet == nil {
                self.hubBet = HubBet(
                    address: token.userAddress,
                    prediction: token.prediction!,
                    wager: token.getVaultBalance()
                )
            } else {
                self.spokeBalance = self.spokeBalance + vault.balance
            }
            token.makeBet(prediction: token.prediction!, wager: <-vault)
            self.madeBets[token.userAddress] <-! token
        }

        priv fun assertSameTokenType(emptyVault: @FungibleToken.Vault) {
            let hub <- self.madeBets.remove(key: self.hubBet!.address)!
            let hubVault <- hub.getVault()

            hubVault.deposit(from: <-emptyVault)

            hub.makeBet(prediction: hub.prediction!, wager: <-hubVault)
            self.madeBets[hub.userAddress] <-! hub
        }

        // pub fun getBet(address: Address): YesNoBetStruct {
        //     pre {
        //         self.hubBet != nil : "No bets have been made"
        //     }
        //     if address == self.hubBet!.userAddress {
        //         return self.hubBet!
        //     }
        //     return self.spokeBets[address]
        //         ?? panic("Member has not made a bet")
        // }

        pub fun resolve(resolution: Bool) {
            pre {
                self.hubBet != nil : "No bets have been made"
                !self.isResolved : "Bet is already resolved"
            }

            if self.hubBet!.prediction == resolution {
                let winner <- self.madeBets.remove(key: self.hubBet!.address)!
                let winnerVault <- winner.getVault()
                for key in self.madeBets.keys {
                    let loser <- self.madeBets.remove(key: key)!
                    let loserVault <- loser.getVault()
                    winnerVault.deposit(from: <-loserVault.withdraw(amount: loserVault.balance))
                    loser.makeBet(prediction: loser.prediction!, wager: <-loserVault)
                    self.madeBets[key] <-! loser
                }
                winner.makeBet(prediction: self.hubBet!.prediction, wager: <-winnerVault)
                self.madeBets[self.hubBet!.address] <-! winner
            } else {
                let loser <- self.madeBets.remove(key: self.hubBet!.address)!
                let loserVault <- loser.getVault()
                for key in self.madeBets.keys {
                    let winner <- self.madeBets.remove(key: key)!
                    let winnerVault <- winner.getVault()
                    winnerVault.deposit(from: <-loserVault.withdraw(amount: winnerVault.balance))
                    winner.makeBet(prediction: winner.prediction!, wager: <-winnerVault)
                    self.madeBets[key] <-! winner
                }
                loser.makeBet(prediction: self.hubBet!.prediction, wager: <-loserVault)
                self.madeBets[self.hubBet!.address] <-! loser
            }
            self.isResolved = true
        }

        pub fun retrieveWinning(claimToken: @DelphaiUsers.ClaimToken): @FungibleToken.Vault {
            let betToken <- self.madeBets.remove(key: claimToken.userAddress)
                ?? panic("Already retrieved winning")
            let vault <- betToken.getVault()
            destroy claimToken
            destroy betToken
            return <- vault
        }

        pub fun getWagers(): [YesNoBetStruct] {
            let wagers: [YesNoBetStruct] = []
            for key in self.madeBets.keys {
                let wager <- self.madeBets.remove(key: key)!
                wagers.append(YesNoBetStruct(
                    userAddress: wager.userAddress,
                    wager: wager.wager,
                    prediction: wager.prediction))
                self.madeBets[key] <-! wager
            }
            return wagers
        }

        destroy () {
            destroy self.madeBets
        }
    }

    pub fun createHubAndSpokesBet(numMembers: Int): @HubAndSpokeBet {
        return <-create HubAndSpokeBet(numMembers: numMembers)
    }

    init () {
        self.yesNoBetMinterStoragePath = /storage/YesNoBetMinter
        self.account.save(<-create YesNoBetTokenMinter(), 
            to: self.yesNoBetMinterStoragePath)
    }
}