import { IApi } from "@/backend/apiInterface";
import { MockClass } from "./util.mocks";

export class MockApiFactory extends MockClass<IApi> {
    getMock() {
        const parent = this;
        return class MockApi implements IApi {
            post<T>(path: string, body: T): Promise<any> {
                return parent.mock.post<T>(path, body);
            }
            authGet<T>(path: string): Promise<T> {
                return parent.mock.authGet<T>(path);
            }
            authPost<T>(path: string, payload: any): Promise<T> {
                return parent.mock.authPost<T>(path, payload);
            }
            authPut<T>(path: string, payload: any): Promise<T> {
                return parent.mock.authPut<T>(path, payload);
            }
        }
    }
}