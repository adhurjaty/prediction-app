import { IApi } from "@/backend/apiInterface";
import { inject, injectable } from "inversify-props";
import { Bet } from "../bets.models";

export interface ICreateBetCommand {
    execute(bet: Bet): Promise<Bet>
}

@injectable()
export class CreateBetCommand implements ICreateBetCommand {
    @inject() private api!: IApi
    
    async execute(bet: Bet): Promise<Bet> {
        return await this.api.authPost('/bets', bet);
    }

}