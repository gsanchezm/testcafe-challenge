import {Selector, t} from 'testcafe'
import {BasePage} from './basePage'

class AddDevicePage extends BasePage{

    constructor(){
        super()

        this.txtSystemName = Selector("input[name='system_name']");
        this.drpType = Selector('#type');
        this.txtHDDCapacity = Selector("#hdd_capacity");
        this.btnSave = Selector('.submitButton');
    }

    typingSystemName(systemName){
        return this._chain(async ()=> await t.typeText(this.txtSystemName,systemName));
    }

    andSelectingType(type){    
        return this._chain(async ()=> await t.click(this.drpType).click(this.drpType.find('option').withText(type)));
    }
    
    withCapacity(capacity){
        return this._chain(async ()=> await t.typeText(this.txtHDDCapacity,capacity));
    }

    async saveDevice(){
        this._chain(async ()=> await t.click(this.btnSave));
        return this;
    }
}

export default new AddDevicePage();