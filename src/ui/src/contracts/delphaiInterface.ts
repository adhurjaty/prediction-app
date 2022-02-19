import * as fcl from "@onflow/fcl";
import { Address, String, Bool, UFix64 } from "@onflow/types";

import placeBetText from 'raw-loader!./cadence/transactions/placeBetComposerFUSD.cdc';
import resolveText from 'raw-loader!./cadence/transactions/voteToResolve.cdc';

export async function executePlaceBetFUSD(
    { betId, prediction, wager }: { betId: string, prediction: boolean, wager: number })
    : Promise<any>
{
    const transactionText = placeBetText as string;
    debugger;
    return await fcl.mutate({
        cadence: transactionText,
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        args: [
            fcl.arg("delphai", Address),
            fcl.arg(betId, String),
            fcl.arg(prediction, Bool),
            fcl.arg(wager, UFix64)
        ],
        limit: 50
    });
}


export async function executeResolution(
    { betId, resolution }: { betId: string, resolution: boolean })
    : Promise<any>
{
    const transactionText = resolveText as string;
    debugger;
    return await fcl.mutate({
        cadence: transactionText,
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        args: [
            fcl.arg("delphai", Address),
            fcl.arg(betId, String),
            fcl.arg(resolution, Bool)
        ],
        limit: 50
    });
}

