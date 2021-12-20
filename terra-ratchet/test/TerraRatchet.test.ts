import {expect} from 'chai';
import {describe, it} from 'mocha';
import {InMemoryExecutedScripts, InMemoryRunnableScripts, NoOpScriptRunner, Script, TerraRatchet,} from '../src';

describe('TerraRatchet', async () => {
    const script1 = {name: '001.sql', hash: '1'} as Script;
    const changedScript1 = {name: '001.sql', hash: 'changed'} as Script;
    const script2 = {name: '002.sql', hash: '2'} as Script;

    it('can calculate the scripts that we need to run', async () => {
        const nothingPreviouslyRun = await new TerraRatchet(new InMemoryRunnableScripts([script1]), new InMemoryExecutedScripts([])).scriptsToRun();
        expect(nothingPreviouslyRun).to.eql([script1]);
        const onePreviouslyRunScript = await new TerraRatchet(new InMemoryRunnableScripts([script1, script2]), new InMemoryExecutedScripts([script1])).scriptsToRun();
        expect(onePreviouslyRunScript).to.eql([script2]);
        const allRun = await new TerraRatchet(new InMemoryRunnableScripts([script1, script2]), new InMemoryExecutedScripts([script1, script2])).scriptsToRun();
        expect(allRun).to.eql([]);
    });

    it('should always sort the scripts so the order returned does not matter', async () => {
        const scriptsToRun = await new TerraRatchet(
            new InMemoryRunnableScripts([script2, script1]),
            new InMemoryExecutedScripts([])).scriptsToRun();
        expect(scriptsToRun).to.eql([script1, script2]);
        const allRun = await new TerraRatchet(
            new InMemoryRunnableScripts([script2, script1]),
            new InMemoryExecutedScripts([script1, script2])).scriptsToRun();
        expect(allRun).to.eql([]);
    });

    it('should error when hash does not match previous executed script', async () => {
        const shouldThrow = async () => await new TerraRatchet(
            new InMemoryRunnableScripts([changedScript1, script2]),
            new InMemoryExecutedScripts([script1])).scriptsToRun();
        await expectPromiseToThrow(shouldThrow(), 'Hash of script "001.sql" does not match');
    });

    it('can register a runner and use it when run is called', async () => {
        const runner = new NoOpScriptRunner();
        const executed = new InMemoryExecutedScripts([script1]);
        await new TerraRatchet(new InMemoryRunnableScripts([script1, script2]), executed)
            .register('sql', runner).run();
        expect(runner.scripts).to.eql([script2]);
        expect(await executed.list()).to.eql([script1, script2]);
    });

    it('can ignore some extensions', async () => {
        const scripts = await new TerraRatchet(new InMemoryRunnableScripts([script1, script2]), new InMemoryExecutedScripts([]))
            .ignore('1.sql')
            .scriptsToRun();
        expect(scripts).to.eql([script2]);
    });
});


export const bigQueryScript: Script = {
    name: 'bigQuery.sql',
    hash: '3599090b47f80e8e7a88931472066e257142643f0e7c79ce2d4d010f8b332029',
};


async function expectPromiseToThrow(promise: Promise<any>, message: string) {
    try {
        await promise;
        expect.fail();
    } catch (e: any) {
        expect(e.message).to.equal(message);
    }
}



