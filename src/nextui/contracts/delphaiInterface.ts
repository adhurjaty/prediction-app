import * as fcl from '@onflow/fcl';
import {send as grpcSend} from "@onflow/transport-grpc"
import * as flow from '@/contracts/flowInterface';
import { Address, String, Bool, UFix64 } from "@onflow/types";
import Wager from '@/models/wager';
import Resolution from '@/models/resolution';
import ResolutionResults from '@/models/resolutionResults';

import placeBetText from 'raw-loader!./cadence/transactions/placeBetComposerFUSD.cdc';
import resolveText from 'raw-loader!./cadence/transactions/voteToResolve.cdc';
import getWagersText from 'raw-loader!./cadence/scripts/getWagers.cdc';
import getResolutionResultsText from 'raw-loader!./cadence/scripts/getResolutionResults.cdc';
import borrowResolutionTokenText from 'raw-loader!./cadence/transactions/borrowResolutionToken.cdc';
import { Result } from '@sniptt/monads/build';


export default class DelphaiInterface {
    private delphaiAddress: string = '0xf8d6e0586b0a20c7';

    constructor() {
        fcl.config()
            .put("accessNode.api", "http://127.0.0.1:8888")
            .put("0xdelphai", "0xf8d6e0586b0a20c7")
            .put("discovery.wallet", "http://localhost:8701/fcl/authn")
            // .put("sdk.transport", grpcSend)
            .put("0xFUSD", "0xf8d6e0586b0a20c7");
        fcl.authenticate();
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
                arg(wager.betId, t.String),
                arg(wager.prediction, t.Bool),
                arg(wager.wager, t.UFix64)
            ],
            limit: 50
        });
    }

    async voteToResolve(resolution: Resolution): Promise<Result<any, string>> {
        const transactionText = resolveText as string;
        debugger;
        return await flow.mutate<any>({
            cadence: transactionText,
            payer: fcl.authz,
            proposer: fcl.authz,
            authorizations: [fcl.authz],
            args: (arg, t) => [
                arg(this.delphaiAddress, t.Address),
                arg(resolution.betId, t.String),
                arg(resolution.vote, t.Bool)
            ],
            limit: 50
        });
    }

    async getWagers(betId: string): Promise<Result<Wager[], string>> {
        const scriptText = getWagersText as string;
        return await flow.query<Wager[]>({
            cadence: scriptText,
            args: (arg, t) => [
                arg(this.delphaiAddress, t.Address),
                arg(this.toBetId(betId), t.String)
            ]
        });
    }

    async getResolutionResults(betId: string): Promise<Result<ResolutionResults, string>> {
        const scriptText = getResolutionResultsText as string;
        return await flow.query<ResolutionResults>({
            cadence: scriptText,
            args: (arg, t) => [
                arg(this.delphaiAddress, t.Address),
                arg(this.toBetId(betId), t.String)
            ]
        });
    }

    async hasResolutionVote(betId: string): Promise<Result<boolean, string>> {
        const transactionText = borrowResolutionTokenText as string;
        return (await flow.mutate({
            cadence: transactionText,
            args: (arg, t) => [
                arg(this.toBetId(betId), t.String)
            ]
        })).map(() => true);
    }

    private toBetId(betId: string): string {
        return `ID${betId.replaceAll('-', '')}`;
    }
}
