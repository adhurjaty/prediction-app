import * as fcl from '@onflow/fcl';
import { err, Err, ok, Ok, Result } from "neverthrow";


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
            ? err(status.errorMessage)
            : ok(status.events)
    } catch (e) {
        var error = e as Error;
        debugger;
        return err((error).message);
    }
}

export async function query<T>(input: FclInput): Promise<Result<T, string>> {
    try {
        return ok(await fcl.query(input) as T);
    } catch (e) {
        var error = e as Error;
        debugger;
        return err((error as Error).message);
    }
}