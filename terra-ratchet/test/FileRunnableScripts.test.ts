import {describe, it} from "mocha";
import {File} from "@bodar/totallylazy/files";
import {FileRunnableScripts} from "../src";
import {expect} from "chai";
import {failingScript, workingScript} from "./shared";

describe('FileRunnableScripts', () => {
    it('should return all scripts in a directory (name and hash)', async () => {
        const directory = new File('examples', __dirname);
        const scripts = await new FileRunnableScripts(directory).scripts();
        expect(scripts).to.eql([failingScript, workingScript]);
    });
});
