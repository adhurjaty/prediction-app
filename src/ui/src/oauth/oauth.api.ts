import { IHttp } from "@/backend/httpInterface";
import { inject, injectable } from "inversify-props";
import { OauthConfirmRequest, OauthConfirmResponse } from "./models";

export interface IOauthApi {
    codeLogin(request: OauthConfirmRequest): Promise<OauthConfirmResponse>,
    secret(): Promise<string>
}

@injectable()
export class OauthAPi implements IOauthApi {
    @inject() private http!: IHttp;

    async codeLogin(request: OauthConfirmRequest): Promise<OauthConfirmResponse> {
        const response = await this.http.post('/oauth/codelogin', request);
        return new OauthConfirmResponse({
            idToken: response.data
        });
    }

    async secret(): Promise<string> {
        return await this.http.authGet('/oauth/secret');
    }
}