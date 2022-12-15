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
let devicesCounter;

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
    devicesCounter = await mainPage.getDevicesMainBox().count;

    const res = []

    getAPIDevices.body.forEach(async device => {
        res.push(device);
    });

    for(var i=0; i<= devicesCounter-1; i++){
        
        const devicesList = await mainPage.getDevices();
        const findDeviceName = devicesList.find(el => el.includes(res[i].system_name));
        const findDeviceType = devicesList.find(el => el.includes(res[i].type));
        const findDeviceCapacity = devicesList.find(el => el.includes(res[i].hdd_capacity));

        await assertions.contains(findDeviceName,res[i].system_name)
        await assertions.contains(findDeviceType,res[i].type)
        await assertions.contains(findDeviceCapacity,res[i].hdd_capacity)

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
    let modifyDevice;
    let firstDevice = await mainPage.returnDeviceNameText(0);

    getAPIDevices.body.forEach(async device => {
        if (device.system_name === firstDevice) {
            deviceId = device.id;
        }
    });

    modifyDevice = await t.request({
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