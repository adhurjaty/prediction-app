import FungibleToken from "./FungibleToken.cdc"
import PayoutInterfaces from "./PayoutInterfaces"

pub contract WinLosePayout {
    pub struct Bettor {
        pub let address: Address
        pub let betId: String
        pub let amount: UFix64

        init(address: Address, betId: String, amount: UFix64) {
            self.address = address
            self.betId = betId
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

    pub resource Payout : PayoutInterfaces.Payout {
        pub let betId: String
        pub var balance: UFix64
        priv let poolVault: @FungibleToken.Vault
        priv let allocatedVaults: @{String: FungibleToken.Vault}
        priv let payoutResults: {String: UFix64}

        init (betId: String, emptyVault: @FungibleToken.Vault) {
            self.betId = betId
            self.poolVault <- emptyVault
            self.balance = 0.0
            self.allocatedVaults <- {}
            self.payoutResults = {}
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

            for loser in betResultsToken.losers {
                losersAmount = losersAmount + loser.amount
            }

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

                self.poolVault.deposit(from: <-winnerReturn)
                i = i + 1
            }

            var depth = 0.0
            var winnersAmount = totalLosersAmount - losersAmount
            i = 0
            while i < betResultsToken.losers.length && winnersAmount > 0.0 {
                let loser = betResultsToken.losers[i]

                var depthToAdd = winnersAmount / UFix64(betResultsToken.losers.length - i)
                if depthToAdd > loser.amount - depth {
                    depthToAdd = loser.amount - depth
                }

                depth = depth + depthToAdd
                winnersAmount = winnersAmount - depthToAdd * UFix64(betResultsToken.losers.length - i)
                i = i + 1
            }

            while i < betResultsToken.losers.length {
                let loser = betResultsToken.losers[i]
                let loserReturn <- self.poolVault.withdraw(amount: loser.amount - depth)
                self.poolVault.deposit(from: <-loserReturn)
                i = i + 1
            }
        }

        pub fun withdraw(token: @PayoutInterfaces.Token): @FungibleToken.Vault {
            let vault <- self.allocatedVaults.remove(key: token.address.toString()) 
                ?? panic("No vault for address")
            self.balance = self.balance - vault.balance
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
}