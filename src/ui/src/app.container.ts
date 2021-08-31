import { container } from 'inversify-props';
import { IApi, Api } from './backend/apiInterface';
import { groupsModule } from './groups';

export function containerBuilder(): void {
    container.addSingleton<IApi>(Api);

    groupsModule.container();
}