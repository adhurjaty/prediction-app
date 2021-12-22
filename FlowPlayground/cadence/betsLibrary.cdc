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

    pub fun createYesNoBet(): @YesNoBet {
        return <-create YesNoBet()
    }
}
