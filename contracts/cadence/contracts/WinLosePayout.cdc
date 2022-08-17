import FungibleToken from "./FungibleToken.cdc"
import PayoutInterfaces from "./PayoutInterfaces.cdc"

pub contract WinLosePayout {
    // TODO: add rake vault eventually
    // let rakeVault: @FungibleToken.Vault

    pub struct Bettor {
        pub let address: Address
        pub let amount: UFix64

        init(address: Address, amount: UFix64) {
            self.address = address
            self.amount = amount
        }
    }

    pub resource BetResults : PayoutInterfaces.ResultsToken {
        pub let betId: String
        pub let winners: [Bettor]
        pub let losers: [Bettor]

        init(betId: String, winners: [Bettor], losers: [Bettor]) {
            self.betId = betId
            self.winners = winners
            self.losers = losers
        }
    }

    pub resource BetResultsTokenMinter {
        pub let betId: String

        init (betId: String) {
            self.betId = betId
        }

        pub fun mint(winners: [Bettor], losers: [Bettor]): @BetResults {
            return <-create BetResults(betId: self.betId, winners: winners, losers: losers)
        }
    }

    pub resource UserToken: PayoutInterfaces.Token {
        pub let betId: String
        pub let address: Address

        init(betId: String, address: Address) {
            self.betId = betId
            self.address = address
        }
    }

    pub resource Payout : PayoutInterfaces.Payout, PayoutInterfaces.TokenMinter {
        priv let poolVault: @FungibleToken.Vault
        priv let allocatedVaults: @{String: FungibleToken.Vault}
        priv let payoutResults: {String: UFix64}

        pub let betId: String
        pub var balance: UFix64
        pub var state: PayoutInterfaces.State

        init (betId: String, emptyVault: @FungibleToken.Vault) {
            self.betId = betId
            self.poolVault <- emptyVault
            self.balance = 0.0
            self.allocatedVaults <- {}
            self.payoutResults = {}
            self.state = PayoutInterfaces.State(isResolved: false, payouts: [])
        }

        pub fun createBetTokenMinter(): @BetResultsTokenMinter {
            return <-create BetResultsTokenMinter(betId: self.betId)
        }

        pub fun mintToken(address: Address): @AnyResource{PayoutInterfaces.Token} {
            return <-create UserToken(betId: self.betId, address: address)
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            self.balance = self.balance + from.balance
            self.poolVault.deposit(from: <-from)
        }

        pub fun resolve(token: @AnyResource{PayoutInterfaces.ResultsToken}) {
            // allocate payments
            // assume the winner and losers are sorted by bet amount ascending
            //                   ____              
            //                  |    |   |....................|
            //                  |    |   |____                |                              
            //              ____|    |       |                |                                                                           
            //             |.........|       |................|                                                                                                        
            //         ____|         |       |____            |                                                                                                            
            //        |              |           |            |                                                                                                        
            //        |              |           |________    |                                                                                                                
            //        |..............|                   |....|                                                                                                        
            //    ____|              |                   |    |                                                                                                        
            //   |                   |                   |____|                                                                                                            
            //
            // first pool the losers funds
            // allocate funds to the winners like in the left diagram
            // give the first winner money until their bet amount is matched
            // repeat until funds are depleted or all the winning bets have been matched
            // if there are funds left over, refer to the right diagram
            // return funds to the first loser if the depleted amount is less than
            // their bet amount * # of losers                                                                                  

            let betResultsToken <- token as! @BetResults
            var losersAmount = 0.0

            // TODO: add rake vault eventually. not sure if it makes sense to just
            // deduct from the winners or from the whole pool

            for loser in betResultsToken.losers {
                losersAmount = losersAmount + loser.amount
            }

            let payouts: [PayoutInterfaces.UserPayout] = []

            let totalLosersAmount = losersAmount

            // allocate funds to winner
            var i = 0
            var height = 0.0
            let winnersLength = betResultsToken.winners.length
            while i < betResultsToken.winners.length {
                let winner = betResultsToken.winners[i]
                let winnerReturn <- self.poolVault.withdraw(amount: winner.amount)

                var heightToAdd = losersAmount / UFix64(winnersLength - i)
                if heightToAdd > winner.amount - height {
                    heightToAdd = winner.amount - height
                }

                height = height + heightToAdd
                losersAmount = losersAmount - heightToAdd * UFix64(winnersLength - i)

                winnerReturn.deposit(from: <-self.poolVault.withdraw(amount: height))

                payouts.append(PayoutInterfaces.UserPayout(
                    address: winner.address,
                    amount: winnerReturn.balance,
                    hasRetrieved: false
                ))

                self.allocatedVaults[winner.address.toString()] <-! winnerReturn
                i = i + 1
            }

            var depth = 0.0
            var winnersAmount = totalLosersAmount - losersAmount
            i = 0
            while i < betResultsToken.losers.length {
                let loser = betResultsToken.losers[i]

                var depthToAdd = winnersAmount / UFix64(betResultsToken.losers.length - i)
                if depthToAdd > loser.amount - depth {
                    depthToAdd = loser.amount - depth
                }

                depth = depth + depthToAdd
                var amount = loser.amount - depth
                if amount < 0.0 {
                    amount = 0.0
                }
                let loserReturn <- self.poolVault.withdraw(amount: amount)
                self.allocatedVaults[loser.address.toString()] <-! loserReturn

                payouts.append(PayoutInterfaces.UserPayout(
                    address: loser.address,
                    amount: amount,
                    hasRetrieved: false
                ))
                
                winnersAmount = winnersAmount - depthToAdd * UFix64(betResultsToken.losers.length - i)
                i = i + 1
            }

            if self.poolVault.balance > 0.0 {
                panic("Could not allocate all funds")
            }

            self.state = PayoutInterfaces.State(isResolved: true, payouts: payouts)

            destroy betResultsToken
        }

        pub fun withdraw(token: @AnyResource{PayoutInterfaces.Token}): @FungibleToken.Vault {
            let userToken <- token as! @UserToken
            let vault <- self.allocatedVaults.remove(key: userToken.address.toString()) 
                ?? panic("No vault for address")
            self.balance = self.balance - vault.balance

            self.state.setRetrieved(address: userToken.address)

            destroy userToken
            return <-vault
        }

        destroy () {
            pre {
                self.balance == 0.0: "Cannot destroy payout contract with a balance"
            }
            destroy self.poolVault
            destroy self.allocatedVaults
        }
    }

    // pub let BetResultsMinterMinterStoragePath: StoragePath
    // TODO: add a vault as a parameter to collect a rake from the winners
    // init () {
    //     self.BetResultsMinterMinterStoragePath = /storage/BetResultsTokenMinterMinter
    //     self.account.save(<-create BetResultsTokenMinterMinter(), to: self.BetResultsMinterMinterStoragePath)
    // }

    pub fun create(betId: String, emptyVault: @FungibleToken.Vault): @Payout {
        return <-create Payout(betId: betId, emptyVault: <-emptyVault)
    }
}