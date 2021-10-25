import { container } from "inversify-props";
import { Id } from "inversify-props/dist/lib/inversify.types";

export default function buildDependencies<T>(func: (...args: any[]) => T, dependencies: Id[]): () => T {
    const injections = dependencies.map(container.get);
    return func.bind(func, ...injections);
}