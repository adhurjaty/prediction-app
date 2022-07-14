import * as fcl from '@onflow/fcl';
import * as flow from '@/contracts/flowInterface';
import Wager from '@/models/wager';
import Resolution from '@/models/resolution';

import placeBetText from 'raw-loader!./cadence/transactions/placeBetComposerFUSD.cdc';
import resolveText from 'raw-loader!./cadence/transactions/voteToResolve.cdc';
import getBetState from 'raw-loader!./cadence/scripts/getBetState.cdc';
import hasResolutionTokenText from 'raw-loader!./cadence/scripts/hasResolutionToken.cdc';
import { Result } from '@sniptt/monads/build';
import BetState from '@/models/betState';


interface FclUser {
    addr: string,
    loggedIn: boolean,
    cid: string
}

export default class DelphaiInterface {
    private delphaiAddress: string = '0xf8d6e0586b0a20c7';

    constructor() {
        
        fcl.config()
            .put("accessNode.api", "http://127.0.0.1:8888")
            .put("0xdelphai", this.delphaiAddress)
            .put("discovery.wallet", "http://localhost:8701/fcl/authn")
            .put("challenge.handshake", "http://localhost:8701/fcl/authn")
            .put("0xFUSD", this.delphaiAddress);
        fcl.currentUser.snapshot()
            .then((user: any) => {
                if (!user.loggedIn) {
                    fcl.authenticate();
                }
            })
        
        // TODO: figure out whether to authenticate or how to deal with this
        // fcl.unauthenticate();
    }

    async placeBet(wager: Wager): Promise<Result<any, string>> {
        const transactionText = placeBetText as string;
        return await flow.mutate<any>({
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

    async voteToResolve(resolution: Resolution): Promise<Result<any, string>> {
        const transactionText = resolveText as string;
        return await flow.mutate<any>({
            cadence: transactionText,
            payer: fcl.authz,
            proposer: fcl.authz,
            authorizations: [fcl.authz],
            args: (arg, t) => [
                arg(this.delphaiAddress, t.Address),
                arg(this.toBetId(resolution.betId), t.String),
                arg(resolution.vote, t.Bool)
            ],
            limit: 100
        });
    }

    async getBetState(betId: string): Promise<Result<BetState, string>> {
        const scriptText = getBetState as string;
        return await flow.query<BetState>({
            cadence: scriptText,
            args: (arg, t) => [
                arg(this.delphaiAddress, t.Address),
                arg(this.toBetId(betId), t.String)
            ]
        });
    }

    async hasResolutionVote(betId: string): Promise<Result<boolean, string>> {
        const scriptText = hasResolutionTokenText as string;
        const user = await this.getCurrentUser();
        return await flow.query<boolean>({
            cadence: scriptText,
            authorizations: [fcl.authz],
            args: (arg, t) => [
                arg(user.addr, t.Address),
                arg(this.toBetId(betId), t.String)
            ]
        });
    }

    async getCurrentUser(): Promise<FclUser> {
        return await fcl.currentUser.snapshot();
    }

    private toBetId(betId: string): string {
        return `ID${betId.replaceAll('-', '')}`;
    }
}
