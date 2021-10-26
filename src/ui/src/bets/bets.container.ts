import 'reflect-metadata';
import { container } from "inversify-props";
import { CreateBetCommand, ICreateBetCommand } from './commands/createBetCommand';
import { BetQuery, IBetQuery } from './queries/betQuery';
import { BetsQuery, IBetsQuery } from './queries/betsQuery';

export default () => {
    container.addSingleton<ICreateBetCommand>(CreateBetCommand);
    container.addSingleton<IBetQuery>(BetQuery);
    container.addSingleton<IBetsQuery>(BetsQuery);
}