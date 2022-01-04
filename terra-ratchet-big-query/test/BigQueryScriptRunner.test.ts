import {File} from "@bodar/totallylazy/files";
import {array} from "@bodar/totallylazy/collections";
import {expect} from "chai";
import {BigQueryScriptRunner} from "../src";
import {canConnectToBigQuery, datasetId, projectId} from "./BigQueryTestConfig";

describe('BigQueryScriptRunner', function () {

    before(async function () {
        if (!await canConnectToBigQuery()) this.skip();
    });

    it('can run a script', async () => {
        const directory = new File('examples', __dirname);
        const updated = await array(new BigQueryScriptRunner(directory, projectId, datasetId)
            .run({name: 'bigQuery.sql', hash: ''}));
        expect(updated).to.eql(['Number of rows affected 0'])
    });
});