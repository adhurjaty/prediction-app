import 'reflect-metadata';
import { container } from 'inversify-props';
import { IHttp, DelphHttp } from './backend/httpInterface';
import { groupsModule } from './groups';
import { oauthModule } from './oauth';
import { ILocalStorage, LocalStorage } from './util/localStorage';
import { ILocationBrowser, LocationBrowser } from './util/locationBrowser';
import { TYPES } from './app.types';
import { usersModule } from './users';
import { betsModule } from './bets';

export function containerBuilder(): void {
    container.addSingleton<IHttp>(DelphHttp, TYPES.HTTP);
    container.addSingleton<ILocalStorage>(LocalStorage, TYPES.LOCAL_STORAGE);
    container.addSingleton<ILocationBrowser>(LocationBrowser, TYPES.LOCATION_BROWSER);

    groupsModule.container();
    oauthModule.container();
    usersModule.container();
    betsModule.container();
}