pub contract interface YesNoBet {
    pub fun makeBet(prediction: Bool)
}

pub contract DummyYesNoBet : YesNoBet {
    pub fun makeBet(prediction: Bool) {
        log("made bet with prediction: ".concat(prediction ? "yes" : "no"))
    }
}
 