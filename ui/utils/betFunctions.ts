import DelphaiInterface from "@/contracts/delphaiInterface";
import Wager from "@/models/wager";
import { err, Err, Result, ResultAsync } from "neverthrow";
import { postModel } from "./nodeInterface";


class BetsInterface {
    constructor(private delphai: DelphaiInterface) { }

    // placeBet(wager: Wager, retried?: boolean): ResultAsync<any, string> {
    //     return postModel<any>(`api/bet/${wager.betId}/transferTokens`, {})
    //         .orElse(e => {
    //             if (retried || !e.includes("Could not get token receiver capability")) {
    //                 return err(e);
    //             }
    //             return this.delphai.saveDelphaiUser()
    //                 .asyncAndThen(_ => this.placeBet(wager, true))
    //         });
    // }
}