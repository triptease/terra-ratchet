export interface Script {
    name: string;
    hash: string;
}

export interface ScriptRunner {
    run(script: Script): AsyncIterableIterator<string>;
}

export interface RunnableScripts {
    scripts(): Promise<Script[]>;
}

export interface ExecutedScripts {
    add(script: Script): Promise<void>;

    list(): Promise<Script[]>;
}