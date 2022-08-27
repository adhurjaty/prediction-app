import DelphaiInterface from "@/contracts/delphaiInterface";
import Resolution from "@/models/resolution";
import Wager from "@/models/wager";
import { errAsync, ResultAsync } from "neverthrow";
import { postModel } from "./nodeInterface";

class BetsInterface {
    constructor(private delphai: DelphaiInterface) { }

    placeBet(wager: Wager, retried?: boolean): ResultAsync<any, string> {
        return this.delphai.transferTokens(wager.betId)
            .orElse(e => {
                if (retried || !e.includes("Could not borrow DelphaiResources.User from storage")) {
                    return errAsync(e);
                }
                return this.delphai.saveDelphaiUser()
                    .andThen(_ => this.placeBet(wager, true))
            })
            .andThen(_ => this.delphai.placeWager(wager))
    }

    voteToResolve(resolution: Resolution): ResultAsync<any, string> {
        return this.delphai.voteToResolve(resolution)
            .andThen(() => postModel<any>(`/api/bets/${resolution.betId}/resolve`, {}));
    }
}

export default BetsInterface;