import {t} from 'testcafe'

export class Assertions{

    async isTrue(actual,message='',timeOut=0){
        await t.expect(actual).ok(message,{timeout: timeOut});
    }

    async isFalse(actual,message='',timeOut=0){
        await t.expect(actual).notOk(message,{timeout: timeOut});
    }
    
    async isEqualsAsExpected(actual,expected,message='',timeOut=0){
        await t.expect(actual).eql(expected,message,{timeout: timeOut});
    }
}

export const assertions = new Assertions();