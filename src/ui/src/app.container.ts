import 'reflect-metadata';
import { container } from 'inversify-props';
import { IApi, Api } from './backend/apiInterface';
import { groupsModule } from './groups';
import { oauthModule } from './oauth';
import { ILocalStorage, LocalStorage } from './util/localStorage';
import { ILocationBrowser, LocationBrowser } from './util/locationBrowser';

export function containerBuilder(): void {
    container.addSingleton<IApi>(Api);
    container.addSingleton<ILocalStorage>(LocalStorage);
    container.addSingleton<ILocationBrowser>(LocationBrowser);

    groupsModule.container();
    oauthModule.container();
}