import { container } from 'inversify-props';
import { groupsModule } from './groups';

export function containerBuilder(): void {
    groupsModule.container();
}