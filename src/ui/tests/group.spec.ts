import { containerBuilder } from '../src/app.container'
import { Group } from '@/groups/models'
import { cid, container, mockSingleton, resetContainer } from 'inversify-props'
import { IApi } from '../src/backend/apiInterface'
import { ICreateGroupCommand } from '../src/groups/commands/createGroupCommand'
import { MockApiFactory } from './__mocks__/backend.mocks'


beforeEach(() => {
    resetContainer(),
    containerBuilder()
})

describe('group command tests', () => {
    it('creates a group successfully ', async () => {
        const apiFactory = new MockApiFactory();
        apiFactory.mock.authPost.mockReturnValue(Promise.resolve(new Group({ name: 'foo' })));
        mockSingleton<IApi>(cid.Api, apiFactory.getMock());

        const sut = container.get<ICreateGroupCommand>(cid.CreateGroupCommand);
        const grp = await sut.execute(new Group({ name: 'bar' }))
        expect(grp).toEqual(new Group({ name: 'foo' }));
        expect(apiFactory.mock.authPost).toHaveBeenCalledWith('/group',
            expect.objectContaining({ name: 'bar' }));
    })
})
