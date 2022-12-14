import { Selector, t } from 'testcafe'
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

    async returnLastDeviceText() {
        return await this.getText(this.deviceName.nth(-1));
    }
    
    async returnLastDeviceText() {
        return await this.getText(this.deviceName.nth(-1));
    }
}

export default new MainPage();