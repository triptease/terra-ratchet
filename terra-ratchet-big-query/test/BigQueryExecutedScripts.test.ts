import {expect} from 'chai';
import {BigQueryExecutedScripts} from "../src";

// Manual tests as you can't delete or drop data from BigQuery reliably
describe.skip('BigQueryExecutedScripts', function () {
    this.timeout(1200000);

    const working = {name: 'working.sh', hash: '128ce5d4b1343fdc899279cb3b7d7b60a8f25e9d32794bf8cb278d95e2b25ed8'};
    const scripts = new BigQueryExecutedScripts('triptease-onboard', 'temp');

    before(async () => {
        await scripts.setup();
    });

    it('should work (as long as the table is empty!)', async () => {
        await scripts.add(working);
        const result = await scripts.list();
        expect(result).to.eql([working]);
    });
});

