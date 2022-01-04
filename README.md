# TerraRatchet

[![<Triptease>](https://circleci.com/gh/triptease/terra-ratchet.svg?style=svg)](https://app.circleci.com/pipelines/github/triptease/terra-ratchet) [![npm version](https://badge.fury.io/js/@triptease%2Fterra-ratchet.svg)](https://www.npmjs.com/package/@triptease/terra-ratchet)

Migrate your environments with real code today!

## Why?

* Have you ever wanted to write real code instead of declarative configuration files?
* Have you ever wanted to use a migration tool for something other than a DB?
* Have you ever wanted to run a single command just once against each environment?
* Have you ever waited for a plugin to be upgraded to use a new feature that was just released?

If the answer to any of those question is yes then TerraRatchet may be what you have been waiting for.

## How?

If you have used a DB migration tool recently you probably already know how to use TerraRatchet, you have a folder with 
a bunch of scripts that need to be run once in a certain order (these are normally checked in):

```shell
scripts
  001-deploy-postgres.sh
  002-create-database.postgres.sql
  003-create-bigquery-dataset.sh
  004-add-permissions-to-dataset.sh
  005-import-table.bigquery.sql
  006-create-redis-server.sh
  007-create-timeseries.redis
```

You have a DB or file server than can store which scripts have been run, normally part of the environment you are deploying.

Now just add TerraRatchet to your build.

## Example (ratchet.ts)

```typescript
import { TerraRatchet, FileRunnableScripts, NoOpScriptRunner, ShellScriptRunner } from '@triptease/terra-ratchet';
import { BigQueryExecutedScripts, BigQueryScriptRunner } from '@triptease/terra-ratchet-big-query';

const projectId = process.env.GOOGLE_CLOUD_PROJECT;
const datasetId = process.env.CI === 'true' ? 'production' : 'development';
const tableId = 'ratchet-table-id';

(async () => {
    const env = { ...process.env, projectId, datasetId };
    const executedScripts = new BigQueryExecutedScripts(projectId, datasetId, tableId);

    const directory = 'scripts';

    await new TerraRatchet(new FileRunnableScripts(directory), executedScripts)
        .ignore('d.ts', 'js', 'map') // ignore generated code
        .register('006-create-redis-server.sh', new NoOpScriptRunner()) // skip manually ran script
        .register('sql', new BigQueryScriptRunner(directory, projectId, datasetId))
        .register('sh', new ShellScriptRunner(directory, env))
        .run();
})();
```


## Details

TerraRatchet is made up of a couple of different parts:

### Script location (RunnableScripts)

| RunnableScripts         | Status   | Description             |
|-------------------------|----------|-------------------------|
| InMemoryRunnableScripts | Released | Can be used for testing |
| FileRunnableScripts     | Released | Point to a folder       |

### Record which script have been run (ExecutedScripts)

| ExecutedScripts         | Status   | Description                                             |
|-------------------------|----------|---------------------------------------------------------|
| InMemoryExecutedScripts | Released | Can be used for testing                                 |
| FileExecutedScripts     | Released | Records which scripts have been run in a json file      |
| BigQueryExecutedScripts | Released | Records which scripts have been run in a BigQuery table |
| PostgresExecutedScripts | Planned  | Records which scripts have been run in a Postgres table |


### How each script should run (ScriptRunner)

It's worth remember than any command can be run if it has a command line, the SQL runners are just convenient

| ScriptRunner         | Status    | Description                                                 |
|----------------------|-----------|-------------------------------------------------------------|
| NoOpScriptRunner     | Released  | Does nothing. Can be used to ignore a manually run script   |
| ShellScriptRunner    | Released  | Used to run a shell command (anything, no plugins required) |
| BigQueryScriptRunner | Released  | Used to run BigQuery SQL statements                         |
| PostgresScriptRunner | Planned   | Used to run Postgres SQL statements                         |


