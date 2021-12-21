import {BigQuery, Table} from "@google-cloud/bigquery";
import {ExecutedScripts, Script} from "@bodar/terra-ratchet";
import {ConsoleLogger} from "@bodar/terra-ratchet/Logger";

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

    async setup(): Promise<Table> {
        if (await this.exists()) return this.table;
        this.logger.log(`Creating new table ${this.fullyQualified()}`);
        const [newTable] = await this.bigQuery.dataset(this.datasetId).createTable(this.tableId, {schema});
        this.logger.log(`Waiting for BigQuery`);
        await delay(60000);
        return newTable;
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
        const [rows] = await this.bigQuery.query(`select *
                                                  from ${this.fullyQualified()}`);
        return rows;
    }

    private fullyQualified(): string {
        return `\`${this.projectId}.${this.datasetId}.${this.tableId}\``;
    }
}

function delay(timeout: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}