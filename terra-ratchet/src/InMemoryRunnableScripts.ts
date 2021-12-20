import {RunnableScripts, Script} from "./api";

export class InMemoryRunnableScripts implements RunnableScripts {
    constructor(private runnableScripts: Script[]) {
    }

    async scripts(): Promise<Script[]> {
        return this.runnableScripts;
    }
}