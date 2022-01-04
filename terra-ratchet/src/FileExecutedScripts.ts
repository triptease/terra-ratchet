import {ExecutedScripts, Script} from "./api";
import {File} from "@bodar/totallylazy/files";

export class FileExecutedScripts implements ExecutedScripts {
    private readonly file: File;

    constructor(file: string | File = 'ratchet.json') {
        this.file = typeof file === "string" ? new File(file) : file;
    }

    async add(script: Script): Promise<void> {
        const data: Script[] = await this.list();
        data.push(script);
        await this.file.content(JSON.stringify(data));
    }

    async list(): Promise<Script[]> {
        return (await this.file.exists) ? JSON.parse(await this.file.content()) : [];
    }
}