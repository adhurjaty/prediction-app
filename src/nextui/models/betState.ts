import Wager from "./wager";
import ResolutionResults from "./resolutionResults"

export default interface BetState {
    wagers: Wager[];
    resolutions: ResolutionResults;
    hubPrediction?: boolean;
    result?: boolean;
}