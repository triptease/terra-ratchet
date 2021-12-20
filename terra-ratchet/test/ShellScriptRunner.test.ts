import {describe, it} from "mocha";
import {File} from "@bodar/totallylazy/files";
import {array} from "@bodar/totallylazy/collections";
import {ShellScriptRunner} from "../src";
import {expect} from "chai";
import {failingScript, workingScript} from "./shared";

describe('ShellScriptRunner', () => {
    const directory = new File('test/examples', File.workingDirectory);

    it('can execute a shell script', async () => {
        const result = await array(new ShellScriptRunner(directory).run(workingScript));
        expect(result.join('')).to.eql('Hello World\n');
    });

    it('should be able to capture stdout, stderr and exit code', async () => {
        const runner = new ShellScriptRunner(directory);

        const output: string[] = [];
        let exitCode: number | undefined = undefined;

        try {
            for await (const text of runner.run(failingScript)) {
                output.push(text);
            }
        } catch (e: any) {
            exitCode = e.code;
        }

        expect(output.join('')).to.eql('Some log\nFailing\n');
        expect(exitCode).to.eql(1);
    });
});
