import mainPage from '../pages/mainPage';
import addDevicePage from '../pages/addDevicePage';
import { assertions } from '../support/assertions';
import { DeviceModel } from '../models/deviceModel';
import dotenv from 'dotenv'
import { faker } from '@faker-js/faker';

dotenv.config();
let deviceId;
let getAPIDevices;
let getFirstDevice;

fixture('Ninja Fixture')
    .page`${process.env.URL}`
    .beforeEach(async t => {
        await t
            .maximizeWindow()

        getAPIDevices = await t.request({
            url: `${process.env.URI}`,
            method: "GET",
        });
    });

test('Verify devices exist on UI', async () => {
    for (let i = 0; i < getAPIDevices.body.length; i++) {
        const element = getAPIDevices.body[i];
        
        //Verify elements are visible
        const {systemNameSelector,systemTypeSelector,systemCapacityelector} = await mainPage.findElementsByAPI(element.system_name,element.type,element.hdd_capacity);
        await assertions.isTrue(systemNameSelector.visible);
        await assertions.isTrue(systemTypeSelector.visible);
        await assertions.isTrue(systemCapacityelector.visible);

        // Button edit and remove exits
        await assertions.isTrue(await mainPage.getDevicesMainBox().nth(i).find('.device-edit').visible);
        await assertions.isTrue(await mainPage.getDevicesMainBox().nth(i).find('.device-remove').visible);
    }
        
});

test('Verify if Device is created using UI', async () => {
    let systemInfo = new DeviceModel(`Device ${faker.name.fullName()}`, process.env.SYSTEM_TYPE, process.env.SYSTEM_CAPACITY);

    mainPage.goToAddDevices();
    await addDevicePage
        .typingSystemName(systemInfo.name)
        .andSelectingType(systemInfo.type)
        .withCapacity(systemInfo.capacity)
        .saveDevice();

    mainPage.reloadPage();

    const devicesList = await mainPage.getDevices();
    const findDeviceName = devicesList.find(el => el.includes(systemInfo.name));
    const findDeviceType = devicesList.find(el => el.includes(systemInfo.type));
    const findDeviceCapacity = devicesList.find(el => el.includes(systemInfo.capacity));

    await assertions.contains(findDeviceName, systemInfo.name)
    await assertions.contains(findDeviceType, systemInfo.type)
    await assertions.contains(findDeviceCapacity, systemInfo.capacity)

});

test('Rename First Device', async t => {
    let firstDevice = await mainPage.returnDeviceNameText(0);

    getAPIDevices.body.forEach(async device => {
        if (device.system_name === firstDevice) {
            deviceId = device.id;
        }
    });

    await t.request({
        url: `${process.env.URI}/${deviceId}`,
        method: "PUT",
        body: { system_name: "Rename Device", type: "WINDOWS_WORKSTATION", hdd_capacity: "10" },
    });

    getFirstDevice = await t.request({
        url: `${process.env.URI}/${deviceId}`,
        method: "GET",
    });

    mainPage.reloadPage();
    await assertions
        .isEqualsAsExpected(await mainPage.getDevicesListNames().nth(0).innerText, getFirstDevice.body.system_name, 'Check device name is updated');
});

test('Delete last device', async t => {
    let lastDevice = await mainPage.returnDeviceNameText(-1);

    getAPIDevices.body.forEach(async device => {
        if (device.system_name === lastDevice) {
            deviceId = device.id;
        }
    });

    await t.request({
        url: `${process.env.URI}/${deviceId}`,
        method: "DELETE",
    });

    mainPage.reloadPage();
    await assertions
        .isFalse(await mainPage.getDevicesListNames().nth(-1).withText(lastDevice).exists, 'Device is not deleted');
});