import {Selector, t} from 'testcafe'
import {BasePage} from './basePage'

class AddDevicePage extends BasePage{

    constructor(){
        super()
    }

    get txtSystemName() { Selector("input[name='system_name']");}
    get drpType() { Selector('#type');}
    get txtHDDCapacity() {Selector("#hdd_capacity");}
    get btnSave() {Selector('.submitButton');}

    typingSystemName(systemName){
        return this._chain(async ()=> await this.enterText(this.txtSystemName,systemName));
    }

    andSelectingType(type){    
        return this._chain(async ()=> await this.selectFromDropDown(this.drpType,type));
    }
    
    withCapacity(capacity){
        return this._chain(async ()=> await this.enterText(this.txtHDDCapacity,capacity));
    }

    async saveDevice(){
        this._chain(async ()=> await this.clickOnElement(this.btnSave));
        return this;
    }
}

export default new AddDevicePage();