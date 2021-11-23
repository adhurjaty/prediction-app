import 'reflect-metadata';
import { container } from "inversify-props";
import { BetsApi, IBetsApi } from './bets.api';

export default () => {
    container.addSingleton<IBetsApi>(BetsApi);
}