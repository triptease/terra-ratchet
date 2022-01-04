import {expect} from 'chai';
import {BigQueryExecutedScripts} from "../src";
import {canConnectToBigQuery, datasetId, projectId, tableId} from "./BigQueryTestConfig";

describe('BigQueryExecutedScripts', function () {
    this.timeout(1200000);

    const working = {name: 'working.sh', hash: '128ce5d4b1343fdc899279cb3b7d7b60a8f25e9d32794bf8cb278d95e2b25ed8'};
    const scripts = new BigQueryExecutedScripts(projectId, datasetId, tableId);

    before(async function () {
        if (!await canConnectToBigQuery()) this.skip();
    });

    it('can add a script', async () => {
        expect(await scripts.list()).to.eql([]);
        await scripts.add(working);
        expect(await scripts.list()).to.eql([working]);
    });
});
