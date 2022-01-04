import {BigQuery, Table} from "@google-cloud/bigquery";
import {ExecutedScripts, Script} from "@triptease/terra-ratchet";
import {ConsoleLogger} from "@triptease/terra-ratchet/Logger";

const schema = {
    fields: [
        {name: 'name', type: 'string', mode: 'required'},
        {name: 'hash', type: 'string', mode: 'required'},
    ],
};

const defaultTableId = 'ratchet_executed_scripts';

export class BigQueryExecutedScripts implements ExecutedScripts {
    constructor(private projectId: string,
                private datasetId: string,
                private tableId: string = defaultTableId,
                private bigQuery = new BigQuery({projectId}),
                private logger = new ConsoleLogger()) {
    }

    get table(): Table {
        return this.bigQuery.dataset(this.datasetId).table(this.tableId);
    }

    private async exists(): Promise<boolean> {
        const [exists] = await this.table.exists();
        return exists;
    }

    async add(script: Script): Promise<void> {
        await this.table.insert(script);
    }

    async list(): Promise<Script[]> {
        if (await this.exists()) {
            const [rows] = await this.bigQuery.query(`select * from ${this.fullyQualified()}`);
            return rows;
        } else {
            this.logger.log(`Creating new table ${this.fullyQualified()}`);
            await this.bigQuery.dataset(this.datasetId).createTable(this.tableId, {schema});
            return [];
        }
    }

    private fullyQualified(): string {
        return `\`${this.projectId}.${this.datasetId}.${this.tableId}\``;
    }
}