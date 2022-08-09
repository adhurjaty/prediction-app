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
        .then(txId => fcl.send([
            fcl.getTransactionStatus(txId)
        ]))
        .then(fcl.decode)
        .then(status => {
            if (status.errorMessage)
                throw new Error(status.errorMessage);
            return status.events
        }),
        e => (e as Error).message);
}

export function query<T>(input: FclInput): ResultAsync<T, string> {
    return ResultAsync.fromPromise(fcl.query(input).then((res: any) => res as T),
        e => (e as Error).message);
}