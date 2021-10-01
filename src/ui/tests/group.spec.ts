import { containerBuilder } from '../src/app.container'
import { Group } from '@/groups/models'
import { cid, container, mockSingleton, resetContainer } from 'inversify-props'
import { IApi } from '../src/backend/apiInterface'
import { ICreateGroupCommand } from '../src/groups/commands/createGroupCommand'


beforeEach(() => {
    resetContainer(),
    containerBuilder()
})

describe('group command tests', () => {
    it('creates a group successfully ', () => {
        ApiMock.postMockValue = new Group({
            name: 'foo'
        });
        mockSingleton<IApi>(cid.Api, ApiMock);

        const sut = container.get<ICreateGroupCommand>(cid.CreateGroupCommand);
        sut.execute(new Group({ name: 'bar' }))
            .then(grp => {
                expect(grp).toEqual(new Group({ name: 'foo' }));
                expect(ApiMock.pathArg).toBe('/group');
                expect(ApiMock.bodyArg).toEqual(new Group({ name: 'bar' }));
            });
    })
})

class ApiMock implements IApi {
    static pathArg: string = "";
    static bodyArg: any | null;
    static postMockValue: any | null;

    post<T>(path: string, body: T): Promise<any> {
        ApiMock.pathArg = path;
        ApiMock.bodyArg = body;

        return Promise.resolve(ApiMock.postMockValue);
    }
    authGet<T>(path: string): Promise<T> {
        throw new Error('Method not implemented.')
    }
    authPost<T>(path: string, payload: any): Promise<T> {
        throw new Error('Method not implemented.')
    }
    authPut<T>(path: string, payload: any): Promise<T> {
        throw new Error('Method not implemented.')
    }
}