import { IApi } from "@/backend/apiInterface";
import { inject } from "inversify-props";

export interface IOauthSecretQuery {
    query(): Promise<string>;
}

export class OauthSecretQuery implements IOauthSecretQuery {
    @inject() api: IApi;

    public async query(): Promise<string> {
        return await this.api.authGet('/oauth/secret');
    }
}
