import { TYPES } from "@/app.types";
import { IHttp } from "@/backend/httpInterface";
import { inject, injectable } from "inversify-props";
import { OauthConfirmRequest, OauthConfirmResponse } from "./models";

export interface IOauthApi {
    codeLogin(request: OauthConfirmRequest): Promise<OauthConfirmResponse>,
    secret(): Promise<string>
}

@injectable()
export class OauthAPi implements IOauthApi {
    @inject(TYPES.HTTP) private http!: IHttp;

    async codeLogin(request: OauthConfirmRequest): Promise<OauthConfirmResponse> {
        const response = await this.http.post('/oauth/codelogin', request);
        return new OauthConfirmResponse({
            idToken: response.data.idToken,
            refreshToken: response.data.refreshToken
        });
    }

    async secret(): Promise<string> {
        return await this.http.authGet('/oauth/secret');
    }
}