import { Selector, t } from 'testcafe'
import { DeviceModel } from '../models/deviceModel';
import { BasePage } from './basePage';

class MainPage extends BasePage {

    constructor() {
        super();

    }

    get deviceMainBox() { return Selector('.device-main-box');}

    get dvDeviceOptions() { return this.deviceMainBox.child('.device-options'); }
    get dvDeviceInfo() { return this.deviceMainBox.child('.device-info'); }
    
    get deviceName() { return this.dvDeviceInfo.child('.device-name'); }
    get deviceType() { return this.dvDeviceInfo.find('.device-type'); }
    get deviceCapacity() { return this.dvDeviceInfo.child('.device-capacity'); 
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

    async deviceCreatedExist(index=0){
        return await this.dvDeviceInfo.nth(index).innerText;
    
        //console.log(`${deviceInformation}`,typeof deviceInformation)
        // for (const key in DeviceModel) {
        //     await t.expect(deviceInformation).contains(DeviceModel[key]);
        // }
    }
}

export default new MainPage();