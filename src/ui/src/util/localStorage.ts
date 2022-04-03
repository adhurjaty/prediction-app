import { injectable } from "inversify-props";

export interface ILocalStorage {
    getItem(key: string): string;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}

@injectable()
export class LocalStorage implements ILocalStorage {
    public getItem(key: string): string {
        return window.localStorage.getItem(key) as string;
    }

    public setItem(key: string, value: string): void {
        window.localStorage.setItem(key, value);
    }

    public removeItem(key: string): void {
        window.localStorage.removeItem(key);
    }

}