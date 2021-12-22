import {describe, it} from "mocha";
import {File} from "@bodar/totallylazy/files";
import {FileExecutedScripts, Script} from "@bodar/terra-ratchet";
import {expect} from "chai";

describe('FileExecutedScripts', () => {
    it('should store the state in JSON file', async () => {
        const file = new File('FileExecutedScripts.test.json', File.tempDirectory);
        if (await file.exists) await file.delete();

        const executedScripts = new FileExecutedScripts(file);
        const script: Script = {name: 'Foo', hash: 'hash'};
        await executedScripts.add(script);

        expect(await file.exists).to.eql(true);
        expect(JSON.parse(await file.content())).to.eql([script]);

        const scripts = await executedScripts.list();
        expect(scripts).to.eql([script]);
    });
});