pub contract BetsLibrary {
    pub struct interface YesNoBet {
        pub fun makeBet(prediction: Bool)
    }

    pub struct DummyYesNoBet : YesNoBet {
        
    
        pub fun makeBet(prediction: Bool) {
            log("made bet with prediction: ".concat(prediction ? "yes" : "no"))
        }
    }

    
}
