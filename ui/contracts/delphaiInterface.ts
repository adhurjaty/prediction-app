import * as fcl from '@onflow/fcl';
import * as flow from '@/contracts/flowInterface';
import Wager from '@/models/wager';
import Resolution from '@/models/resolution';

import setupDelphaiUserText from 'raw-loader!./cadence/transactions/setupDelphaiUser.cdc';
// import deleteDelphaiUserText from 'raw-loader!./cadence/transactions/deleteDelphaiUser.cdc';
import placeWagerText from 'raw-loader!./cadence/transactions/placeWagerFUSD.cdc';
import resolveText from 'raw-loader!./cadence/transactions/voteToResolve.cdc';
import getState from 'raw-loader!./cadence/scripts/getComposerState.cdc';
import getFUSDBalance from 'raw-loader!./cadence/scripts/getFUSDBalance.cdc';
import getFlowBalance from 'raw-loader!./cadence/scripts/getFlowBalance.cdc';
import retrievePayoutText from 'raw-loader!./cadence/transactions/retrievePayoutFUSD.cdc';
import { ResultAsync } from 'neverthrow';
import ComposerState from '@/models/composerState';
import config from '@/appConfig';


interface FclUser {
    addr: string,
    loggedIn: boolean,
    cid: string
}

export default class DelphaiInterface {
    private delphaiAddress: string;

    constructor() {
        const flowConfig = config.flow;
        this.delphaiAddress = flowConfig.delphaiAddress;
        fcl.config()
            .put("accessNode.api", flowConfig.accessNode)
            .put("0xdelphai", this.delphaiAddress)
            .put("discovery.wallet", flowConfig.discoveryWallet)
            // .put("challenge.handshake", flowConfig.discoveryWallet)
            .put("0xFUSD", flowConfig.fusd)
            .put("0xFungibleToken", flowConfig.fungibleToken)
            .put("0xFlowToken", flowConfig.flowToken);
        fcl.currentUser.snapshot()
            .then((user: any) => {
                if (!user.loggedIn) {
                    fcl.authenticate();
                }
            })
        
        // TODO: figure out whether to authenticate or how to deal with this
        // fcl.unauthenticate();
    }

    saveDelphaiUser(): ResultAsync<any, string> {
        const transactionText = setupDelphaiUserText as string;
        return flow.mutate<any>({
            cadence: transactionText,
            payer: fcl.authz,
            proposer: fcl.authz,
            authorizations: [fcl.authz],
            limit: 200
        });
    }

    // deleteDelphaiUser(): ResultAsync<any, string> {
    //     const transactionText = deleteDelphaiUserText as string;
    //     return flow.mutate<any>({
    //         cadence: transactionText,
    //         payer: fcl.authz,
    //         proposer: fcl.authz,
    //         authorizations: [fcl.authz],
    //         limit: 200
    //     });
    // }

    placeWager(wager: Wager): ResultAsync<any, string> {
        const transactionText = placeWagerText as string;
        return flow.mutate<any>({
            cadence: transactionText,
            payer: fcl.authz,
            proposer: fcl.authz,
            authorizations: [fcl.authz],
            args: (arg, t) => [
                arg(this.delphaiAddress, t.Address),
                arg(this.toBetId(wager.betId), t.String),
                arg(wager.prediction, t.Bool),
                arg(wager.wager.toFixed(2), t.UFix64)
            ],
            limit: 200
        });
    }

    voteToResolve(resolution: Resolution): ResultAsync<any, string> {
        const transactionText = resolveText as string;
        return flow.mutate<any>({
            cadence: transactionText,
            payer: fcl.authz,
            proposer: fcl.authz,
            authorizations: [fcl.authz],
            args: (arg, t) => [
                arg(this.delphaiAddress, t.Address),
                arg(this.toBetId(resolution.betId), t.String),
                arg(resolution.vote, t.Bool)
            ],
            limit: 200
        });
    }

    getComposerState(betId: string): ResultAsync<ComposerState, string> {
        const scriptText = getState as string;
        return flow.query<ComposerState>({
            cadence: scriptText,
            args: (arg, t) => [
                arg(this.delphaiAddress, t.Address),
                arg(this.toBetId(betId), t.String)
            ]
        });
    }

    // hasResolutionVote(betId: string): ResultAsync<boolean, string> {
    //     const scriptText = hasResolutionTokenText as string;
    //     return this.getCurrentUser()
    //         .andThen(user => flow.query<boolean>({
    //             cadence: scriptText,
    //             authorizations: [fcl.authz],
    //             args: (arg, t) => [
    //                 arg(user.addr, t.Address),
    //                 arg(this.toBetId(betId), t.String)
    //             ]
    //         }));
    // }

    retrieveWinning(betId: string): ResultAsync<any, string> {
        const transactionText = retrievePayoutText as string;
        return flow.mutate<any>({
            cadence: transactionText,
            payer: fcl.authz,
            proposer: fcl.authz,
            authorizations: [fcl.authz],
            args: (arg, t) => [
                arg(this.delphaiAddress, t.Address),
                arg(this.toBetId(betId), t.String)
            ],
            limit: 200
        });
    }

    getCurrentUser(): ResultAsync<FclUser, string> {
        return ResultAsync.fromSafePromise(fcl.currentUser.snapshot());
    }

    getFUSDBalance(): ResultAsync<number, string> {
        const scriptText = getFUSDBalance as string;
        return this.getCurrentUser()
            .andThen(user => flow.query<number>({
                cadence: scriptText,
                payer: fcl.authz,
                authorizations: [fcl.authz],
                args: (arg, t) => [
                    arg(user.addr, t.Address)
                ]
            }));
    }

    getFlowBalance(): ResultAsync<number, string> {
        const scriptText = getFlowBalance as string;
        return this.getCurrentUser()
            .andThen(user => flow.query<number>({
                cadence: scriptText,
                payer: fcl.authz,
                authorizations: [fcl.authz],
                args: (arg, t) => [
                    arg(user.addr, t.Address)
                ]
            }));
    }

    private toBetId(betId: string): string {
        return `${betId.replaceAll('-', '')}`;
    }
}
