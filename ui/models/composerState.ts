import BetState from "./betState";
import PayoutState from "./payoutState";
import ResolverState from "./resolverState";

export default interface ComposerState {
    betState: BetState
    resolverState: ResolverState
    payoutState: PayoutState
}