import 'reflect-metadata';
import { TOKEN_KEY, VERIFIER_KEY } from "@/util/constants";
import { ILocalStorage } from "@/util/localStorage";
import { ILocationBrowser } from "@/util/locationBrowser";
import { cid, container, inject, injectable } from "inversify-props";
import { OauthConfirmRequest } from "../models";
import { IOauthConfirmQuery } from "../queries/oauthConfirmQuery";

export interface IConfirmCommand {
    execute(code: string, state: string): Promise<void>;
}

@injectable()
export class ConfirmCommand implements IConfirmCommand {
    @inject() localStorage: ILocalStorage
    // don't know why @inject won't work, but this works
    // TODO: figure this out
    private confirmQuery = container.get<IOauthConfirmQuery>(cid.IOauthConfirmQuery);
    private location = container.get<ILocationBrowser>(cid.ILocationBrowser);

    public async execute(code: string, state: string): Promise<void> {
        const stateParams = new URLSearchParams(state);
        const origin = stateParams.get('origin');
        const verifier = this.localStorage.getItem(VERIFIER_KEY);

        if(!verifier) {
            throw new Error('ERROR, could not get verifier from local storage');
        }

        const response = await this.confirmQuery.query(new OauthConfirmRequest({
            code: code,
            verifier: verifier
        }));

        this.localStorage.setItem(TOKEN_KEY, response.idToken);
        if(origin) {
            this.location.go(origin);
        }
    }

}