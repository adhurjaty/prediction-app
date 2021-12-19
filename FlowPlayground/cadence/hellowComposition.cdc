pub contract HelloComposition {

    pub resource interface Thing {
        pub fun greet(): String
    }

    pub resource Hello : Thing {
        pub fun greet(): String {
            return "hello"
        }
    }

    pub resource World : Thing {
        pub fun greet(): String {
            return "world"
        }
    }


    // The init() function is required if the contract contains any fields.
    init() {
        self.account.save(<- create Hello(), to:/storage/HelloCompositionFirst)
        self.account.save(<- create World(), to:/storage/HelloCompositionSecond)
    }

    // Public function that returns our friendly greeting!
    pub fun hello(): String {
        let first: @AnyResource{HelloComposition.Thing} 
            <- self.account.load<@AnyResource{HelloComposition.Thing}>
                (from: /storage/HelloCompositionSecond)!
        let second: @AnyResource{HelloComposition.Thing} 
            <- self.account.load<@AnyResource{HelloComposition.Thing}>
                (from: /storage/HelloCompositionFirst)!

        let greeting: String = first.greet().concat(" ").concat(second.greet());
        destroy  first
        destroy  second
        return  greeting
    }
}
 