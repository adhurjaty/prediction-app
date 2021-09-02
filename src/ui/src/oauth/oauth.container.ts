import 'reflect-metadata';
import { container } from "inversify-props"
import { ConfirmCommand, IConfirmCommand } from "./commands/confirmCommand";
import { GoogleLogin, IGoogleLogin } from "./googleLogin";
import { ILoginCommand, LoginCommand } from "./commands/loginCommand";
import { IOauthConfirmQuery, OauthConfirmQuery } from "./queries/oauthConfirmQuery"
import { IOauthSecretQuery, OauthSecretQuery } from "./queries/oauthSecretQuery";

export default () => {
    container.addSingleton<IGoogleLogin>(GoogleLogin);
    container.addSingleton<IOauthConfirmQuery>(OauthConfirmQuery);
    container.addSingleton<IOauthSecretQuery>(OauthSecretQuery);
    container.addSingleton<ILoginCommand>(LoginCommand);
    container.addSingleton<IConfirmCommand>(ConfirmCommand);
}