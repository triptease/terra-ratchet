import {ExecutedScripts, Script} from "./api";

export class InMemoryExecutedScripts implements ExecutedScripts {
    constructor(private executedScripts: Script[]) {
    }

    async add(script: Script): Promise<void> {
        this.executedScripts.push(script);
    }

    async list(): Promise<Script[]> {
        return this.executedScripts;
    }
}