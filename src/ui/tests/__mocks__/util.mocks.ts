import { CalledWithMock, mock } from 'jest-mock-extended';

export class MockClass<T> {
    public mock: { [K in keyof T]: T[K] extends (...args: infer A) => infer B ? CalledWithMock<B, A> : T[K]; } & T

    constructor() {
        this.mock = mock<T>();
    }    
}
