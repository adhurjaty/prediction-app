pub contract BetsLibrary {
    pub resource YesNoBet {
        pub var prediction: Bool?
        pub var wager: UInt16

        init () {
            self.prediction = nil
            self.wager = 0
        }

        pub fun makeBet(prediction: Bool, wager: UInt16) {
            self.prediction = prediction
            self.wager = wager
        }
    }

    pub resource DummyYesNoBet {
        priv let initBets: @[YesNoBet]
        priv let madeBets: @{Address: YesNoBet}

        init (numMembers: UInt) {
            var n = numMembers
            self.initBets <- []
            while n > 0 {
                self.initBets.append(<-create YesNoBet())
                n = n - 1
            }
            self.madeBets <- {}
        }

        pub fun withdrawBet(): @YesNoBet {
            return <-self.initBets.removeFirst()
        }

        pub fun makeBet(acct: AuthAccount, bet: @YesNoBet) {
            log("bet made")
            self.madeBets[acct.address] <-! bet
        }

        destroy () {
            destroy self.initBets
            destroy self.madeBets
        }
    }

    pub fun createDummyYesNoBet(numMembers: UInt): @DummyYesNoBet {
        return <-create DummyYesNoBet(numMembers: numMembers)
    }
}
 