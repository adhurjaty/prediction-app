import 'reflect-metadata';
import { container } from "inversify-props";
import { BetsApi, IBetsApi } from './bets.api';
import { Delphai, IDelphai } from '@/contracts/delphaiInterface';

export default () => {
    container.addSingleton<IBetsApi>(BetsApi);
    container.addSingleton<IDelphai>(Delphai)
}