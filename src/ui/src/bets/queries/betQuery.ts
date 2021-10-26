import { IApi } from "@/backend/apiInterface";
import { inject, injectable } from "inversify-props";
import { Bet } from "../bets.models";

export interface IBetQuery {
    query(id: string): Promise<Bet>
}

@injectable()
export class BetQuery implements IBetQuery {
    @inject() private api!: IApi

    async query(id: string): Promise<Bet> {
        return await this.api.authGet<Bet>(`/bets/${id}`);
    }

}