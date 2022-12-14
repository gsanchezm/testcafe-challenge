import {t} from 'testcafe'

export class Assertions{

    async isTrue(actual,text='',timeOut=0){
        await t.expect(actual).ok(text,{timeout: timeOut});
    }

    async isFalse(actual,text='',timeOut=0){
        await t.expect(actual).notOk(text,{timeout: timeOut});
    }
    
    async isEqualsAsExpected(actual,expected){
        await t.expect(actual).eql(expected);
    }
}

export const assertions = new Assertions();