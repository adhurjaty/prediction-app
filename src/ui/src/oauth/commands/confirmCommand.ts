import { TOKEN_KEY, VERIFIER_KEY } from "@/util/constants";
import { ILocalStorage } from "@/util/localStorage";
import { ILocationBrowser } from "@/util/locationBrowser";
import { inject, injectable } from "inversify-props";
import { OauthConfirmRequest } from "../models";
import { IOauthConfirmQuery } from "../queries/oauthConfirmQuery";

export interface IConfirmCommand {
    execute(code: string, state: string): Promise<void>;
}

@injectable()
export class ConfirmCommand implements IConfirmCommand {
    @inject() localStorage: ILocalStorage
    @inject() location: ILocationBrowser;
    @inject() confirmQuery: IOauthConfirmQuery;

    public async execute(code: string, state: string): Promise<void> {
        const stateParams = new URLSearchParams(state);
        const origin = stateParams.get('origin');
        const verifier = window.localStorage.getItem(VERIFIER_KEY);

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