import DelphaiInterface from "@/contracts/delphaiInterface";
import Wager from "@/models/wager";
import { errAsync, ResultAsync } from "neverthrow";

class BetsInterface {
    constructor(private delphai: DelphaiInterface) { }

    placeBet(wager: Wager, retried?: boolean): ResultAsync<any, string> {
        return this.delphai.transferTokens(wager.betId)
            .orElse(e => {
                if (retried || !e.includes("Could not get token receiver capability")) {
                    return errAsync(e);
                }
                return this.delphai.saveDelphaiUser()
                    .andThen(_ => this.placeBet(wager, true))
            })
            .andThen(_ => this.delphai.placeWager(wager))
    }
}

export default BetsInterface;