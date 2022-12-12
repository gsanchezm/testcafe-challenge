import mainPage from '../pages/mainPage';
import addDevicePage from '../pages/addDevicePage';
import {assertions} from '../support/assertions';
import {DeviceModel} from '../models/deviceModel';
import dotenv from 'dotenv'

dotenv.config();
let getAPIDevices;
let getFirstDevice;
let modifyDevice;
let devicesCounter;
let systemInfo;

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
            systemInfo = new DeviceModel(device.system_name,device.type,device.hdd_capacity); 
            for(var arrayElements=0; arrayElements<3;arrayElements++){
                assertions.checkIfActualValue(deviceUIText.withText(systemInfo[Object.keys(systemInfo)[arrayElements]]).exists).isTrue();
            }
        });

        assertions.checkIfActualValue(btnDevicesEdit.exists).isTrue();
        assertions.checkIfActualValue(btnDevicesRemove.exists).isTrue();
      }
});

test('Verify if Device is created using UI',async () =>{
    systemInfo = new DeviceModel(process.env.SYSTEM_NAME,process.env.SYSTEM_TYPE,process.env.SYSTEM_CAPACITY); 

    devicesCounter = await mainPage.getDevicesMainBox().count;

    mainPage.goToAddDevices();
    await addDevicePage.typingSystemName(systemInfo.name).andSelectingType(systemInfo.type).withCapacity(systemInfo.capacity).saveDevice();

    for(var i=0; i<= devicesCounter-1; i++){
        var deviceUIText = await mainPage.getDevicesListNames().nth(i);

        for(var arrayElements=0; arrayElements<3; arrayElements++){
            assertions.checkIfActualValue(deviceUIText.withText(systemInfo[Object.keys(systemInfo)[arrayElements]]).exists).isTrue();
        }
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