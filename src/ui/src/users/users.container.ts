import { container } from 'inversify-props';
import 'reflect-metadata';
import { IUsersApi, UsersApi } from './users.api';

export default () => {
    container.addSingleton<IUsersApi>(UsersApi);
}