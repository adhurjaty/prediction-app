import FungibleToken from "./FungibleToken.cdc"
import PayoutInterfaces from "./PayoutInterfaces.cdc"
import BetInterfaces from "./BetInterfaces.cdc"
import WinLosePayout from "./WinLosePayout.cdc"

pub contract YesNoBet {
    pub struct Wager: BetInterfaces.Wager {
        pub let address: Address
        pub let amount: UFix64
        pub let bet: Bool

        init(address: Address, amount: UFix64, bet: Bool) {
            self.address = address
            self.amount = amount
            self.bet = bet
        }
    }

    pub struct Node {
        pub let wager: Wager
        pub let left: Node?
        pub let right: Node?

        init(wager: Wager, left: Node?, right: Node?) {
            self.wager = wager
            self.left = left
            self.right = right
        }
    }

    pub struct SortedBinaryTree {
        pub var root: Node?

        init() {
            self.root = nil
        }

        pub fun insert(wager: Wager) {
            self.root = self.insertHelper(wager: wager, node: self.root)
        }

        priv fun insertHelper(wager: Wager, node: Node?): Node {
            if node == nil {
                return Node(wager: wager, left: nil, right: nil)
            }
            if wager.amount < node!.wager.amount {
                return Node(wager: node!.wager, 
                    left: self.insertHelper(wager: wager, node: node!.left), 
                    right: node!.right)
            } else {
                return Node(wager: node!.wager, 
                    left: node!.left, 
                    right: self.insertHelper(wager: wager, node: node!.right))
            }
        }

        pub fun toList(): [Wager] {
            if self.root == nil {
                return []
            }
            return self.toListHelper(node: self.root!)
        }

        priv fun toListHelper(node: Node): [Wager] {
            var list: [Wager] = []
            if node.left != nil {
                list = list.concat(self.toListHelper(node: node.left!))
            }
            list.append(node.wager)
            if node.right != nil {
                list = list.concat(self.toListHelper(node: node.right!))
            }
            return list
        }
    }

    pub struct State: BetInterfaces.State {
        pub var isResolved: Bool
        pub let wagers: {String: AnyStruct{BetInterfaces.Wager}}
        priv let sortedWagers: SortedBinaryTree

        init(isResolved: Bool) {
            self.isResolved = isResolved
            self.wagers = {}
            self.sortedWagers = SortedBinaryTree()
        }

        pub fun addWager(wager: Wager) {
            self.wagers[wager.address.toString()] = wager
            self.sortedWagers.insert(wager: wager)
        }

        pub fun setResolved() {
            self.isResolved = true
        }

        pub fun toSortedList(): [Wager] {
            return self.sortedWagers.toList()
        }
    }

    pub resource UserToken: BetInterfaces.Token {
        pub let betId: String
        pub let address: Address
        pub let wager: @FungibleToken.Vault
        pub var bet: Bool?

        init(betId: String, address: Address, emptyVault: @FungibleToken.Vault) {
            self.betId = betId
            self.address = address
            self.wager <-emptyVault
            self.bet = nil
        }

        pub fun makeWager(bet: Bool, wager: @FungibleToken.Vault) {
            pre {
                wager.balance > 0.0: "Wager must be greater than 0"
            }
            self.bet = bet
            self.wager.deposit(from: <-wager)
        }

        destroy () {
            destroy self.wager
        }
    }

    pub resource Result: BetInterfaces.Result {
        pub let betId: String
        pub let result: Bool?

        init(betId: String, result: Bool?) {
            self.betId = betId
            self.result = result
        }
    }

    pub resource ResultTokenMinter {
        pub let betId: String

        init(betId: String) {
            self.betId = betId
        }

        pub fun mint(outcome: Bool?): @Result {
            return <-create Result(betId: self.betId, result: outcome)
        }
    }

    pub resource Bet: BetInterfaces.Bet, BetInterfaces.TokenMinter {
        priv let payoutTokenMinter: @WinLosePayout.BetResultsTokenMinter
        priv let emptyVault: @FungibleToken.Vault
        
        pub let betId: String
        pub let state: AnyStruct{BetInterfaces.State}

        init(betId: String, payoutTokenMinter: @WinLosePayout.BetResultsTokenMinter,
            emptyVault: @FungibleToken.Vault)
        {
            self.betId = betId
            self.state = State(isResolved: false)
            self.payoutTokenMinter <- payoutTokenMinter
            self.emptyVault <-emptyVault
        }

        pub fun placeBet(token: @AnyResource{BetInterfaces.Token}): @FungibleToken.Vault {
            pre {
                !self.state.isResolved: "Bet is already resolved"
                !self.state.wagers.containsKey(token.address.toString()): "User has already placed bet"
            }
            let userToken <- token as! @UserToken
            if userToken.bet == nil {
                panic("User has not indicated yes or no")
            }

            (self.state as! State).addWager(wager: Wager(address: userToken.address, 
                amount: userToken.wager.balance, bet: userToken.bet!))
            let vault <-userToken.wager.withdraw(amount: userToken.wager.balance)

            destroy userToken

            return <-vault
        }

        pub fun resolve(token: @AnyResource{BetInterfaces.Result}): @AnyResource{PayoutInterfaces.ResultsToken} {
            pre {
                !self.state.isResolved: "Bet is already resolved"
            }

            let resultToken <- token as! @Result

            (self.state as! State).setResolved()
            
            let sortedWagers = (self.state as! State).toSortedList()
            
            let winners: [WinLosePayout.Bettor] = []
            let losers: [WinLosePayout.Bettor] = []
            for wager in sortedWagers {
                if wager.bet == resultToken.result || resultToken.result == nil {
                    winners.append(WinLosePayout.Bettor(address: wager.address, amount: wager.amount))
                } else {
                    losers.append(WinLosePayout.Bettor(address: wager.address, amount: wager.amount))
                }
            }

            destroy resultToken

            return <-self.payoutTokenMinter.mint(winners: winners, losers: losers)
        }

        pub fun mintToken(address: Address): @AnyResource{BetInterfaces.Token} {
            return <-create UserToken(betId: self.betId, address: address, 
                emptyVault: <-self.emptyVault.withdraw(amount: 0.0))
        }

        pub fun createResultTokenMinter(): @ResultTokenMinter {
            return <-create ResultTokenMinter(betId: self.betId)
        }

        destroy () {
            destroy self.payoutTokenMinter
            destroy self.emptyVault
        }
    }

    pub fun create(betId: String, payoutTokenMinter: @WinLosePayout.BetResultsTokenMinter,
        emptyVault: @FungibleToken.Vault): @Bet 
    {
        return <-create Bet(betId: betId, payoutTokenMinter: <-payoutTokenMinter, 
            emptyVault: <-emptyVault)
    }
}