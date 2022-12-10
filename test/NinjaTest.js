import mainPage from '../pages/mainPage';
import addDevicePage from '../pages/addDevicePage';
import {assertions} from '../support/assertions'
import dotenv from 'dotenv'

dotenv.config();
let getAPIDevices;
let getFirstDevice;
let modifyDevice;
let devicesCounter;

fixture('Ninja Fixture')
    .page`${process.env.URL}`
    .beforeEach(async t =>{
        await t
                .maximizeWindow()

        getAPIDevices = await t.request({
        url: `${process.env.URI}`,
        method: "GET",
    });
});

test('Verify devices exist on UI',async () =>{
    devicesCounter = await mainPage.getDevicesMainBox().count;

    for(var i=0; i<= devicesCounter-1; i++){
        var deviceUIText = await mainPage.getDevicesListNames().nth(i);
        var btnDevicesEdit = await mainPage.getDevicesMainBox().nth(i).child('.device-edit');
        var btnDevicesRemove = await mainPage.getDevicesMainBox().nth(i).child('.device-remove');

        getAPIDevices.body.forEach(async device => {
            assertions.checkIfActualValue(deviceUIText.withText(device.system_name).exists).isTrue();  
            assertions.checkIfActualValue(deviceUIText.withText(device.type).exists).isTrue();
            assertions.checkIfActualValue(deviceUIText.withText(device.hdd_capacity).exists).isTrue();
        });

        assertions.checkIfActualValue(btnDevicesEdit.exists).isTrue();
        assertions.checkIfActualValue(btnDevicesRemove.exists).isTrue();
      }
});

test('Verify is Device is created using UI',async () =>{
    devicesCounter = await mainPage.getDevicesMainBox().count;

    mainPage.goToAddDevices();
    await addDevicePage.typingSystemName(process.env.SYSTEM_NAME).andSelectingType(process.env.SYSTEM_TYPE).withCapacity(process.env.SYSTEM_CAPACITY).saveDevice();

    for(var i=0; i<= devicesCounter-1; i++){
        var deviceUIText = await mainPage.getDevicesListNames().nth(i);

        assertions.checkIfActualValue(deviceUIText.withText(process.env.SYSTEM_NAME).exists).isTrue();  
        assertions.checkIfActualValue(deviceUIText.withText(process.env.SYSTEM_TYPE).exists).isTrue();
        assertions.checkIfActualValue(deviceUIText.withText(process.env.SYSTEM_CAPACITY).exists).isTrue();
    }
});

test('Rename First Device',async t =>{
    var deviceId;
    var firstDevice = await mainPage.getDevicesListNames().nth(0).innerText

    getAPIDevices.body.forEach(async device =>{
        if(device.system_name === firstDevice){
            deviceId = device.id;
        }
    });

    modifyDevice = await t.request({
        url: `${process.env.URI}/${deviceId}`,
        method: "PUT",
        body :{ system_name: "Rename Device", type: "WINDOWS_WORKSTATION", hdd_capacity: "10"},
    }); 

    getFirstDevice = await t.request({
        url: `${process.env.URI}/${deviceId}`,
        method: "GET",
    });


    mainPage.reloadPage();
    assertions.checkIfActualValue(await mainPage.getDevicesListNames().nth(0).innerText).isEqualsAsExpected(getFirstDevice.body.system_name)
});

test('Delete last device',async t =>{
    var deviceId;
    devicesCounter = await mainPage.getDevicesMainBox().count;
    var lastDevice = await mainPage.getDevicesListNames().nth(devicesCounter-1).innerText

    getAPIDevices.body.forEach(async device =>{
        if(device.system_name === lastDevice){
            deviceId = device.id;
        }
    });

    await t.request({
        url: `${process.env.URI}/${deviceId}`,
        method: "DELETE",
    });

    for(var i=0; i<= devicesCounter-1; i++){
        var deviceUIText = await mainPage.getDevicesListNames().nth(i);

        assertions.checkIfActualValue(deviceUIText.withText(lastDevice).exists).isFalse();  
    }
});