import { Selector, t } from 'testcafe'
import { BasePage } from './basePage';

class MainPage extends BasePage {

    constructor() {
        super();

    }

    get deviceMainBox() { return Selector('.device-main-box');}

    get dvDeviceOptions() { return this.deviceMainBox.child('.device-options'); }
    get dvDeviceInfo() { return this.deviceMainBox.child('.device-info'); }
    
    get deviceName() { return this.dvDeviceInfo.find('.device-name'); }
    get deviceType() { return this.dvDeviceInfo.find('.device-type'); }
    get deviceCapacity() { return this.dvDeviceInfo.find('.device-capacity'); 
}
    get btnAddDevice() { return Selector('.submitButton'); }
    

    getDevicesListNames() {
        return this.deviceName;
    }

    getDevicesMainBox() {
        return this.deviceMainBox;
    }

    async goToAddDevices() {
        await this.clickOnElement(this.btnAddDevice);
    }
    
    async returnDeviceNameText(index=0) {
        return await this.getText(this.deviceName.nth(index));
    }

    async returnDeviceTypeText(index=0) {
        return await this.getText(this.deviceType.nth(index));
    }

    async returnDeviceCapacityText(index=0) {
        return await this.getText(this.deviceCapacity.nth(index));
    }

    async getDevices(){
        const res = []
        for(var i=0; i<= await this.getDevicesMainBox().count-1; i++){
            const devicesText = await this.dvDeviceInfo.nth(i).innerText;
            res.push(devicesText);
        }
        return res;
    }

    async findElementsByText(systemName, type, hddCapacity, index = 0){
        const systemNameSelector = this.deviceName().withText(systemName);
        const systemTypeSelector = this.deviceType().withText(type);
        const systemCapacityelector = this.deviceCapacity().withText(hddCapacity);

        return {systemNameSelector,systemTypeSelector,systemCapacityelector}
    }
}

export default new MainPage();