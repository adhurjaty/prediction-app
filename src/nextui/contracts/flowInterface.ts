import * as fcl from '@onflow/fcl';
import { Address, String, Bool, UFix64 } from "@onflow/types";
import Wager from '@/models/wager';
import Resolution from '@/models/resolution';
import ResolutionResults from '@/models/resolutionResults';

import placeBetText from 'raw-loader!./cadence/transactions/placeBetComposerFUSD.cdc';
import resolveText from 'raw-loader!./cadence/transactions/voteToResolve.cdc';
import getWagersText from 'raw-loader!./cadence/scripts/getWagers.cdc';
import getResolutionResultsText from 'raw-loader!./cadence/scripts/getResolutionResults.cdc';
import borrowResolutionTokenText from 'raw-loader!./cadence/transactions/borrowResolutionToken.cdc';

export function initFcl() {
    fcl.config({
        "accessNode.api": "http://127.0.0.1:3569",
        "0xdelphai": "0xf8d6e0586b0a20c7",
        "discovery.wallet": "http://localhost:8701/fcl/authn",
        "0xFUSD": "0xf8d6e0586b0a20c7"
    });
}

export async function placeBet(wager: Wager): Promise<any> {
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


export async function voteToResolve(resolution: Resolution): Promise<any> {
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
    const scriptText = getWagersText as string;
    return await fcl.query({
        cadence: scriptText,
        args: [
            fcl.arg("delphai", Address),
            fcl.arg("betId", betId)
        ]
    }) as Wager[];
}

export async function getResolutionResults(betId: string): Promise<ResolutionResults> {
    const scriptText = getResolutionResultsText as string;
    return await fcl.query({
        cadence: scriptText,
        args: [
            fcl.arg("delphai", Address),
            fcl.arg("betId", betId)
        ]
    }) as ResolutionResults;
}

export async function hasResolutionVote(betId: string): Promise<boolean> {
    const transactionText = borrowResolutionTokenText as string;
    const response = await fcl.mutate({
        cadence: transactionText,
        args: [
            fcl.arg("betId", betId)
        ]
    });
    debugger;
    // TODO: figure out what error looks like
    return true;
}