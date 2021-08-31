import { ILocalStorage } from "@/util/localStorage";
import { inject, injectable } from "inversify-props";
import { VERIFIER_KEY } from '@/util/constants';
import { IGoogleLogin } from "./googleLogin";
import { ILocationBrowser } from "@/util/locationBrowser";

export interface ILoginCommand {
    execute(origin: string | undefined): void;
}

@injectable()
export class LoginCommand implements ILoginCommand {
    @inject() localStorage: ILocalStorage
    @inject() googleLogin: IGoogleLogin
    @inject() location: ILocationBrowser
    
    execute(origin: string | undefined): void {
        const verifier = this.googleLogin.createVerifier();
        this.localStorage.setItem(VERIFIER_KEY, verifier);
        this.location.go(this.googleLogin.codeUrl(verifier, origin));
    }

}