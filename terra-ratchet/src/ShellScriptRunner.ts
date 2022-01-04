import {Script, ScriptRunner} from "./api";
import {File} from "@bodar/totallylazy/files";
import {run} from "@bodar/totallylazy/run";

export class ShellScriptRunner implements ScriptRunner {
    private readonly directory: File;

    constructor(directory: string | File, private env?: NodeJS.ProcessEnv) {
        this.directory = typeof directory === "string" ? new File(directory) : directory;
    }

    async* run(script: Script): AsyncIterableIterator<string> {
        yield* run({
            command: this.directory.child(script.name).absolutePath,
            cwd: this.directory.absolutePath,
            env: this.env,
        } as any);
    }
}