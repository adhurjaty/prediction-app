import ResolutionResults from "./resolutionResults"
import WagerResponse from "./wagerResponse";

export default interface BetState {
    wagers: WagerResponse[];
    resolutions: ResolutionResults;
    hubPrediction?: boolean;
    result?: boolean;
}