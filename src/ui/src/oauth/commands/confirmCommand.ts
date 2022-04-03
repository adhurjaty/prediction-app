import { REFRESH_KEY, TOKEN_KEY, VERIFIER_KEY } from "@/util/constants";
import { ILocalStorage } from "@/util/localStorage";
import { ILocationBrowser } from "@/util/locationBrowser";
import { inject, injectable } from "inversify-props";
import { OauthConfirmRequest } from "../models";
import { TYPES } from '@/app.types';
import { IOauthApi } from "../oauth.api";

export interface IConfirmCommand {
    execute(code: string, state: string): Promise<void>;
}

@injectable()
export class ConfirmCommand implements IConfirmCommand {
    @inject(TYPES.LOCAL_STORAGE) private localStorage: ILocalStorage
    @inject(TYPES.LOCATION_BROWSER) private location: ILocationBrowser;
    @inject() private oauthAPi!: IOauthApi;

    public async execute(code: string, state: string): Promise<void> {
        const stateParams = new URLSearchParams(state);
        const origin = stateParams.get('origin');
        const verifier = this.localStorage.getItem(VERIFIER_KEY);

        if(!verifier) {
            throw new Error('ERROR, could not get verifier from local storage');
        }

        const response = await this.oauthAPi.codeLogin(new OauthConfirmRequest({
            code: code,
            verifier: verifier
        }));

        this.localStorage.setItem(TOKEN_KEY, response.idToken);
        this.localStorage.setItem(REFRESH_KEY, response.refreshToken);
        if(origin) {
            this.location.go(origin);
        } else {
            this.location.go('/groups');
        }
    }
}