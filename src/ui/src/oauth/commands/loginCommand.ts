import 'reflect-metadata';
import { ILocalStorage } from "@/util/localStorage";
import { inject, injectable } from "inversify-props";
import { VERIFIER_KEY } from '@/util/constants';
import { IGoogleLogin } from "../googleLogin";
import { ILocationBrowser } from "@/util/locationBrowser";
import { TYPES } from '@/app.types';

export interface ILoginCommand {
    execute(origin: string | undefined): void;
}

@injectable()
export class LoginCommand implements ILoginCommand {
    @inject() private googleLogin: IGoogleLogin
    @inject(TYPES.LOCAL_STORAGE) private localStorage: ILocalStorage
    @inject(TYPES.LOCATION_BROWSER) private location: ILocationBrowser;
    
    execute(origin: string | undefined): void {
        const verifier = this.googleLogin.createVerifier();
        this.localStorage.setItem(VERIFIER_KEY, verifier);
        this.location.go(this.googleLogin.codeUrl(verifier, origin));
    }
}