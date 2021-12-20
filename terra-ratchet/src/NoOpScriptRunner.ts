import {Script, ScriptRunner} from "./api";

export class NoOpScriptRunner implements ScriptRunner {
    public readonly scripts: Script[] = [];

    async* run(script: Script): AsyncIterableIterator<string> {
        this.scripts.push(script);
        yield `Skipping ${script.name}`;
    }
}