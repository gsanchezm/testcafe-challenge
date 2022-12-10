import {Selector, t} from 'testcafe'
import { BasePage } from './basePage';

class MainPage extends BasePage{

    constructor(){
        super();
        this.deviceMainBox = Selector('.device-main-box');
        this.dvDeviceOptions = this.deviceMainBox.child('.device-options');
        this.dvDeviceInfo = this.deviceMainBox.child('.device-info');
        this.deviceName = this.dvDeviceInfo.child('.device-name');
        this.deviceType = this.dvDeviceInfo.find('.device-type');
        this.deviceCapacity = this.dvDeviceInfo.child('.device-capacity');
        this.btnAddDevice = Selector('.submitButton');
    }

    getDevicesListNames(){
       return this.deviceName;
    }

    getDevicesMainBox(){
        return this.deviceMainBox;
    }

    async goToAddDevices(){
        await t.click(this.btnAddDevice);
    }
}

export default new MainPage();