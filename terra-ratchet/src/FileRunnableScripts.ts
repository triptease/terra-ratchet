import {RunnableScripts, Script} from "./api";
import {File} from "@bodar/totallylazy/files";
import {filter, map} from "@bodar/totallylazy/transducers";
import {hashSHA256} from "./hash";
import {array} from "@bodar/totallylazy/array";

export class FileRunnableScripts implements RunnableScripts {
    private readonly directory: File;

    constructor(directory: string | File) {
        this.directory = typeof directory === "string" ? new File(directory) : directory;
    }

    async scripts(): Promise<Script[]> {
        const result: Script[] = [];
        for await (const child of this.directory.children()) {
            if (!(await child.isDirectory)) {
                const content = await child.content();
                result.push({name: child.name, hash: hashSHA256(content)} as Script);
            }
        }
        return result;
    }
}