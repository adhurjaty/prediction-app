import 'reflect-metadata';
import { ILocalStorage } from "@/util/localStorage";
import { cid, container, inject, injectable } from "inversify-props";
import { VERIFIER_KEY } from '@/util/constants';
import { IGoogleLogin } from "../googleLogin";
import { ILocationBrowser } from "@/util/locationBrowser";

export interface ILoginCommand {
    execute(origin: string | undefined): void;
}

@injectable()
export class LoginCommand implements ILoginCommand {
    @inject() private googleLogin: IGoogleLogin
    @inject() private localStorage: ILocalStorage
    // don't know why @inject won't work, but this works
    // TODO: figure this out
    private location = container.get<ILocationBrowser>(cid.ILocationBrowser);
    
    execute(origin: string | undefined): void {
        const verifier = this.googleLogin.createVerifier();
        this.localStorage.setItem(VERIFIER_KEY, verifier);
        this.location.go(this.googleLogin.codeUrl(verifier, origin));
    }
}