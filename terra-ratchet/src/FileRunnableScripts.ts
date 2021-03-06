import {RunnableScripts, Script} from "./api";
import {File} from "@bodar/totallylazy/files";
import {array} from "@bodar/totallylazy/collections";
import {map} from "@bodar/totallylazy/transducers";
import {hashSHA256} from "./hash";

export class FileRunnableScripts implements RunnableScripts {
    private readonly directory: File;

    constructor(directory: string | File) {
        this.directory = typeof directory === "string" ? new File(directory) : directory;
    }

    async scripts(): Promise<Script[]> {
        return Promise.all(await array(this.directory.children(), map(async (file: File) => {
            return {name: file.name, hash: hashSHA256(await file.content())} as Script;
        })));
    }
}