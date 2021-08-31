import { IApi } from "@/backend/apiInterface";
import { inject, injectable } from "inversify-props";
import { OauthConfirmRequest, OauthConfirmResponse } from "./models";

export interface IOauthConfirmQuery {
    query(request: OauthConfirmRequest): Promise<OauthConfirmResponse>;
}

@injectable()
export class OauthConfirmQuery implements IOauthConfirmQuery {
    @inject() api: IApi;

    public async query(request: OauthConfirmRequest): Promise<OauthConfirmResponse> {
        const response = await this.api.post('/oauth/codelogin', request);
        return new OauthConfirmResponse({
            idToken: response.data
        });
    }
}