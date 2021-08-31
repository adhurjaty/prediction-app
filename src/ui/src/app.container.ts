import { container } from 'inversify-props';
import { IApi, Api } from './backend/apiInterface';
import { groupsModule } from './groups';
import { oauthModule } from './oauth';

export function containerBuilder(): void {
    container.addSingleton<IApi>(Api);

    groupsModule.container();
    oauthModule.container();
}