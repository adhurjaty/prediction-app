import 'reflect-metadata';
import { container } from "inversify-props"
import { ConfirmCommand, IConfirmCommand } from "./commands/confirmCommand";
import { GoogleLogin, IGoogleLogin } from "./googleLogin";
import { ILoginCommand, LoginCommand } from "./commands/loginCommand";
import { IOauthApi, OauthAPi } from './oauth.api';

export default () => {
    container.addSingleton<IGoogleLogin>(GoogleLogin);
    container.addSingleton<ILoginCommand>(LoginCommand);
    container.addSingleton<IConfirmCommand>(ConfirmCommand);
    container.addSingleton<IOauthApi>(OauthAPi);
}