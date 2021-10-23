import { container } from 'inversify-props';
import 'reflect-metadata';
import { IUserFullQuery, UserFullQuery } from './queries/userFullQuery';
import { IUserQuery, UserQuery } from './queries/userQuery';

export default () => {
    container.addSingleton<IUserQuery>(UserQuery);
    container.addSingleton<IUserFullQuery>(UserFullQuery);
}