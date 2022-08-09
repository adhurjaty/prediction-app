import DelphaiInterface from "@/contracts/delphaiInterface";
import Wager from "@/models/wager";
import { errAsync, ResultAsync } from "neverthrow";
import { postModel } from "./nodeInterface";


class BetsInterface {
    constructor(private delphai: DelphaiInterface) { }

    placeBet(wager: Wager, retried?: boolean): ResultAsync<any, string> {
        return postModel<any>(`api/bet/${wager.betId}/transferTokens`, {})
            .orElse(e => {
                if (retried || !e.includes("Could not get token receiver capability")) {
                    return errAsync(e);
                }
                return this.delphai.saveDelphaiUser()
                    .andThen(_ => this.placeBet(wager, true))
            })
            .andThen(_ => this.delphai.placeBet(wager))
    }
}

export default BetsInterface;