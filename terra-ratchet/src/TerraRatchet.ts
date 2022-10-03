import {ExecutedScripts, RunnableScripts, Script, ScriptRunner} from "./api";
import {ascending, by} from "@bodar/totallylazy/collections";
import {array} from "@bodar/totallylazy/array";
import {ConsoleLogger, Logger} from "./Logger";
import {zip} from "@bodar/totallylazy/transducers";

export class TerraRatchet {
    private runners = new Map<string, ScriptRunner>();
    private ignoreExtensions: string[] = [];

    constructor(private runnables: RunnableScripts, private executed: ExecutedScripts, private logger: Logger = new ConsoleLogger()) {
    }

    async scriptsToRun(): Promise<Script[]> {
        const runnables = sort((await this.runnables.scripts())
            .filter(s => !this.ignoreExtensions.some(extension => s.name.endsWith(extension))));
        const executed = sort(await this.executed.list());
        this.logger.log(`Previously executed scripts ${executed.length}`);
        const zipped = array(runnables, zip(executed));
        for (const [runnable, executed] of zipped) {
            if (runnable.name !== executed.name) throw new Error(`Order of scripts does not match`);
            if (runnable.hash !== executed.hash) throw new Error(`Hash of script "${runnable.name}" does not match`);
        }
        return runnables.filter(s => !executed.some(e => e.name === s.name && e.hash === s.hash));
    }

    ignore(...extensions: string[]): TerraRatchet {
        this.ignoreExtensions.push(...extensions);
        return this;
    }

    register(extension: string, runner: ScriptRunner): TerraRatchet {
        this.runners.set(extension, runner);
        return this;
    }

    async run(): Promise<void> {
        const scripts = await this.scriptsToRun();
        this.logger.log(`Running ${scripts.length} scripts`);
        for (const script of scripts) {
            const [, runner] = Array.from(this.runners.entries()).find(([extension]) => script.name.endsWith(extension)) || [];
            if (!runner) throw new Error(`No registered runner for ${script.name}`);
            this.logger.log(`Running script: ${script.name}`);
            for await (const text of runner.run(script)) {
                this.logger.log(text);
            }
            await this.executed.add(script);
        }
    }
}

function sort(scripts: Script[]): Script[] {
    return scripts.sort(by('name', ascending));
}