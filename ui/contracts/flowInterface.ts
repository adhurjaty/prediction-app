import * as fcl from '@onflow/fcl';
import { Err, Ok, Result } from "@sniptt/monads/build";


interface FclInput {
    cadence: string,
    args?: (arg: (val: any, t: any) => any, t: any) => any[],
    payer?: any,
    proposer?: any,
    authorizations?: any[],
    limit?: number
}

export async function mutate<T>(input: FclInput): Promise<Result<T, string>> {
    try {
        const status = await (fcl.mutate(input) as Promise<string>)
            .then(txId => fcl.send([
                fcl.getTransactionStatus(txId)
            ]))
            .then(fcl.decode);
        return status.errorMessage
            ? Err(status.errorMessage)
            : Ok(status.events)
    } catch (err) {
        var error = err as Error;
        debugger;
        return Err((error).message);
    }
}

export async function query<T>(input: FclInput): Promise<Result<T, string>> {
    try {
        return Ok(await fcl.query(input) as T);
    } catch (err) {
        var error = err as Error;
        debugger;
        return Err((error as Error).message);
    }
}