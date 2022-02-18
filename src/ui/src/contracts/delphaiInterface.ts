import placeBetText from 'raw-loader!./cadence/transactions/placeBetComposerFUSD.cdc';
import * as fcl from "@onflow/fcl";

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
        args: (arg: any, t: any) => {
            return [
                arg(betId, t.String),
                arg(prediction, t.Bool),
                arg(wager, t.UFix64)];
        },
        limit: 50
    });
}