import { TYPES } from "@/app.types";
import { IHttp } from "@/backend/httpInterface";
import { inject, injectable } from "inversify-props";
import { Bet } from "./bets.models";

export interface IBetsApi {
    get(id: string): Promise<Bet>,
    list(): Promise<Bet[]>,
    create(bet: Bet & { groupId: string }): Promise<Bet>
    update(bet: Bet): Promise<Bet>
}

@injectable()
export class BetsApi implements IBetsApi {
    @inject(TYPES.HTTP) private http!: IHttp;

    async get(id: string): Promise<Bet> {
        return await this.http.authGet<Bet>(`/bets/${id}`);
    }
    
    async list(): Promise<Bet[]> {
        return await this.http.authGet<Bet[]>('/bets');
    }

    async create(bet: Bet & { groupId: string }): Promise<Bet> {
        return await this.http.authPost('/bets', bet);
    }

    async update(bet: Bet): Promise<Bet> {
        return await this.http.authPut(`/bets/${bet.id}`, bet);
    }

}