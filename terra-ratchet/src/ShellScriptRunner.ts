import {Script, ScriptRunner} from "./api";
import {File} from "@bodar/totallylazy/files";
import {run} from "@bodar/totallylazy/run";

export class ShellScriptRunner implements ScriptRunner {
    constructor(private directory: File, private env?: NodeJS.ProcessEnv) {
    }

    async* run(script: Script): AsyncIterableIterator<string> {
        yield* run({
            command: this.directory.child(script.name).absolutePath,
            cwd: this.directory.absolutePath,
            env: this.env,
        } as any);
    }
}