import { injectable } from "inversify-props";

export interface ILocationBrowser {
    go(url: string): void;
}

@injectable()
export class LocationBrowser implements ILocationBrowser {
    go(url: string): void {
        window.location.href = url;
    }
}