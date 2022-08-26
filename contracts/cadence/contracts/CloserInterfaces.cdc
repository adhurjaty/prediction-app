pub contract CloserInterfaces {
    pub resource interface Closer {
        pub fun betMade(): Bool
        pub fun checkClosed(): Bool
    }

    pub fun closerPathName(betId: String): String {
        return "Closer_".concat(betId)
    }
}