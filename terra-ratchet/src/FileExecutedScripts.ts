import {ExecutedScripts, Script} from "./api";
import {File} from "@bodar/totallylazy/files";

export class FileExecutedScripts implements ExecutedScripts {
    constructor(private file: File = new File('ratchet.json', File.workingDirectory)) {
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