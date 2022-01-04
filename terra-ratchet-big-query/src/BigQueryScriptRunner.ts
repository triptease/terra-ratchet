import {Script, ScriptRunner} from "@triptease/terra-ratchet";
import {BigQuery} from "@google-cloud/bigquery";
import {get} from "@bodar/totallylazy/functions";
import {File} from "@bodar/totallylazy/files";

export class BigQueryScriptRunner implements ScriptRunner {
    constructor(private directory: File,
                private projectId: string,
                private datasetId: string,
                private bigQuery = new BigQuery({projectId})) {
    }

    async* run(script: Script): AsyncIterableIterator<string> {
        const query = await this.directory.child(script.name).content();
        const [job] = await this.bigQuery.createQueryJob({
            query,
            defaultDataset: {datasetId: this.datasetId, projectId: this.projectId}
        });
        // wait for job to finish
        await job.getQueryResults();
        const [metaData] = await job.getMetadata();
        const rowsAffected = get(() => metaData.statistics.query.numDmlAffectedRows, 0);
        yield 'Number of rows affected ' + rowsAffected;
    }
}