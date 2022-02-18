import txt from 'raw-loader!./cadence/transactions/createBetResource.cdc';

export async function execute(): Promise<any> {
    const foo = txt as string;
    debugger;
    const path = `/src/contracts/cadence/transactions/${name}.cdc`;
    const transaction = await readFile(path);
    debugger;
    return transaction;
}