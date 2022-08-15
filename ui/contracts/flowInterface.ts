import * as fcl from '@onflow/fcl';
import { err, Err, ok, Ok, Result, ResultAsync } from "neverthrow";


interface FclInput {
    cadence: string,
    args?: (arg: (val: any, t: any) => any, t: any) => any[],
    payer?: any,
    proposer?: any,
    authorizations?: any[],
    limit?: number
}

export function mutate<T>(input: FclInput): ResultAsync<T, string> {
    return ResultAsync.fromPromise((fcl.mutate(input) as Promise<string>)
        .then(async txId => {
            return await fcl.tx(txId).onceSealed() as Promise<any>;
        })
        .then(status => {
            if (status.errorMessage)
                throw new Error(status.errorMessage);
            return status.events
        }),
        e => {
            return (e as Error).message ?? e;
        });
}

export function query<T>(input: FclInput): ResultAsync<T, string> {
    return ResultAsync.fromPromise(fcl.query(input).then((res: any) => res as T),
        e => (e as Error).message ?? e);
}