import {File} from "@bodar/totallylazy/files";
import {array} from "@bodar/totallylazy/collections";
import {expect} from "chai";
import {BigQueryScriptRunner} from "../src";

describe('BigQueryScriptRunner', function() {
    it.skip('can run a script', async () => {
        const directory = new File('examples', __dirname);
        const updated = await array(new BigQueryScriptRunner(directory, 'triptease-onboard', 'temp')
            .run({name: 'bigQuery.sql', hash: ''}));
        expect(updated).to.eql(['Number of rows affected 0'])
    });
});