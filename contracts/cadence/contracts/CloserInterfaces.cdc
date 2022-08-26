pub contract CloserInterfaces {
    pub resource interface Closer {
        pub fun betMade(): Bool
        pub fun checkClosed(): Bool
    }
}