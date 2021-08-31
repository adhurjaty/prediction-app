import { container } from "inversify-props"
import { ConfirmCommand, IConfirmCommand } from "./confirmCommand";
import { GoogleLogin, IGoogleLogin } from "./googleLogin";
import { ILoginCommand, LoginCommand } from "./loginCommand";
import { IOauthConfirmQuery, OauthConfirmQuery } from "./oauthConfirmQuery"
import { IOauthSecretQuery, OauthSecretQuery } from "./oauthSecretQuery";

export default () => {
    container.addSingleton<IGoogleLogin>(GoogleLogin);
    container.addSingleton<IOauthConfirmQuery>(OauthConfirmQuery);
    container.addSingleton<IOauthSecretQuery>(OauthSecretQuery);
    container.addSingleton<ILoginCommand>(LoginCommand);
    container.addSingleton<IConfirmCommand>(ConfirmCommand);
}