import { IApi } from "@/backend/apiInterface";
import { inject, injectable } from "inversify-props";
import { Bet } from "../bets.models";

export interface IBetsQuery {
    query(): Promise<Bet[]>
}

@injectable()
export class BetsQuery implements IBetsQuery {
    @inject() private api!: IApi

    async query(): Promise<Bet[]> {
        return await this.api.authGet<Bet[]>('/bets');
    }
}