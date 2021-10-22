import { container } from 'inversify-props';
import 'reflect-metadata';
import { IUserQuery, UserQuery } from './queries/userQuery';

export default () => {
    container.addSingleton<IUserQuery>(UserQuery);
}