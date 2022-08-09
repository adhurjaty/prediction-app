import DelphaiInterface from "@/contracts/delphaiInterface";
import Wager from "@/models/wager";
import { Err, Result } from "neverthrow";
import { postModel } from "./nodeInterface";


class BetsInterface {
    constructor(private delphai: DelphaiInterface) { }

    async placeBet(wager: Wager, retried?: boolean): Promise<Result<any, string>> {
        const transferResult = await postModel<any>(`api/bet/${wager.betId}/transferTokens`, {});
        if (transferResult.isErr()
            && !retried
            && transferResult.err().map(err => err.includes("Could not get token receiver capability")))
        {
            const self = this;
            const t = await (await this.delphai.saveDelphaiUser())
                .andThen(() => self.placeBet(wager, true))
            return await this.placeBet(wager, true);
        }
        return transferResult;
    }
}