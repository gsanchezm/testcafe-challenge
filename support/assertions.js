import {t} from 'testcafe'

export class Assertions{
    actual;

    checkIfActualValue(actual){
        this.actual = actual;
        return this;
    }

    async isTrue(){
        await t.expect(this.actual).ok;
    }

    async isFalse(){
        await t.expect(this.actual).notOk;
    }
    
    async isEqualsAsExpected(expected){
        await t.expect(this.actual).eql(expected);
    }
}

export const assertions = new Assertions();