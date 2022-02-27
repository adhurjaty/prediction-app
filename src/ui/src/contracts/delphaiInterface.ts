import { Resolution, ResolutionResults, Wager } from "@/bets/bets.models";
import * as fcl from "@onflow/fcl";
import { Address, String, Bool, UFix64 } from "@onflow/types";

import placeBetText from 'raw-loader!./cadence/transactions/placeBetComposerFUSD.cdc';
import resolveText from 'raw-loader!./cadence/transactions/voteToResolve.cdc';

export async function executePlaceBetFUSD(wager: Wager)
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
            fcl.arg(wager.betId, String),
            fcl.arg(wager.prediction, Bool),
            fcl.arg(wager.wager, UFix64)
        ],
        limit: 50
    });
}


export async function executeResolution(resolution: Resolution)
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
            fcl.arg(resolution.betId, String),
            fcl.arg(resolution.vote, Bool)
        ],
        limit: 50
    });
}

export async function getWagers(betId: string): Promise<Wager[]> {
    
}

export async function getResolutionResults(betId: string): Promise<ResolutionResults> {

}

export async function hasResolutionVote(betId: string): Promise<boolean> {
    
}