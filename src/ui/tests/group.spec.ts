import { containerBuilder } from '../src/app.container'
import { Group } from '@/groups/models'
import { cid, container, mockSingleton, resetContainer } from 'inversify-props'
import { IHttp } from '../src/backend/httpInterface'
import { MockApiFactory } from './__mocks__/backend.mocks'
import { IGroupsApi } from '@/groups/groups.api'


beforeEach(() => {
    resetContainer(),
    containerBuilder()
})

describe('group command tests', () => {
    it('creates a group successfully ', async () => {
        const apiFactory = new MockApiFactory();
        apiFactory.mock.authPost.mockReturnValue(Promise.resolve(new Group({ name: 'foo' })));
        mockSingleton<IHttp>(cid.Api, apiFactory.getMock());

        const sut = container.get<IGroupsApi>(cid.GroupsApi);
        const grp = await sut.create(new Group({ name: 'bar' }))
        expect(grp).toEqual(new Group({ name: 'foo' }));
        expect(apiFactory.mock.authPost).toHaveBeenCalledWith('/group',
            expect.objectContaining({ name: 'bar' }));
    })
})
