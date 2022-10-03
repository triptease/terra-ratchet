import {describe, it} from "mocha";
import {File} from "@bodar/totallylazy/files";
import {array} from "@bodar/totallylazy/array";
import {ShellScriptRunner} from "../src";
import {expect} from "chai";
import {failingScript, helloWorld, workingScript} from "./shared";
import {last, single} from "@bodar/totallylazy/transducers";

describe('ShellScriptRunner', () => {
    const directory = new File('examples', __dirname);

    it('can execute a shell script', async () => {
        const result = await array(new ShellScriptRunner(directory).run(workingScript));
        expect(result.join('')).to.eql('Hello World\n');
    });

    it('can execute a script using a custom command ', async () => {
        // When run in IDE we get a warning from node, so just compare last line
        const result = await single(new ShellScriptRunner(directory, undefined, ['pnpm', 'esr']).run(helloWorld), last());
        expect(result).to.eql('Hello World\n');
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

        expect(output).to.eql(['Some log\nFailing\n']);
        expect(exitCode).to.eql(1);
    });
});
