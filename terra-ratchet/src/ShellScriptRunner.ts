import {Script, ScriptRunner} from "./api";
import {File} from "@bodar/totallylazy/files";
import {run} from "@bodar/totallylazy/run";

export class ShellScriptRunner implements ScriptRunner {
    private readonly directory: File;

    constructor(directory: string | File, private env?: NodeJS.ProcessEnv, private commandPrefix: string[] = []) {
        this.directory = typeof directory === "string" ? new File(directory) : directory;
    }

    run(script: Script): AsyncIterableIterator<string> {
        const command = [...this.commandPrefix, this.directory.child(script.name).absolutePath];
        return run({command, cwd: this.directory.absolutePath, env: this.env});
    }
}