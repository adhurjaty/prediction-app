pub contract BetsLibrary {
    pub resource interface YesNoBet {
        pub fun makeBet(prediction: Bool)
    }

    pub resource DummyYesNoBet : YesNoBet {
        
    
        pub fun makeBet(prediction: Bool) {
            log("made bet with prediction: ".concat(prediction ? "yes" : "no"))
        }
    }

    pub fun createDummyYesNoBet(): @DummyYesNoBet {
        return <-create DummyYesNoBet()
    }
}
