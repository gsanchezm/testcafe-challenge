import mainPage from '../pages/mainPage';
import addDevicePage from '../pages/addDevicePage';
import {assertions} from '../support/assertions';
import {DeviceModel} from '../models/deviceModel';
import dotenv from 'dotenv'
import { faker } from '@faker-js/faker';

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

    getAPIDevices.body.forEach(async device => {
        systemInfo = new DeviceModel(device.system_name + 'XXXX',device.type,device.hdd_capacity); 

        for(var i=0; i<= devicesCounter-1; i++){
            const deviceUIText = await mainPage.getDevicesListNames().nth(i);
            var btnDevicesEdit = await mainPage.getDevicesMainBox().nth(i).child('.device-edit');
            var btnDevicesRemove = await mainPage.getDevicesMainBox().nth(i).child('.device-remove');

            console.log(`Iteration: ${i}`)
            // assertions.checkIfActualValue(deviceUIText.withExactText(device.system_name + 'XXXX').visible).isTrue();
            // assertions.checkIfActualValue(deviceUIText.withExactText(device.type).visible).isTrue();
            // assertions.checkIfActualValue(deviceUIText.withExactText(device.hdd_capacity).visible).isTrue();
            if(i<3){
                //assertions.checkIfActualValue(deviceUIText.withExactText(systemInfo[Object.keys(systemInfo)[i]]).visible).isTrue();

            }
            
        }

        assertions.checkIfActualValue(btnDevicesEdit.visible).isTrue();
        assertions.checkIfActualValue(btnDevicesRemove.visible).isTrue();
    });
});

test.only('Verify if Device is created using UI',async () =>{
    systemInfo = new DeviceModel(`Device ${faker.name.fullName()}`,process.env.SYSTEM_TYPE,process.env.SYSTEM_CAPACITY); 
    devicesCounter = await mainPage.getDevicesMainBox().count;
    const arraeglo = [];

    mainPage.goToAddDevices();
    await addDevicePage
        .typingSystemName(systemInfo.name)
        .andSelectingType(systemInfo.type)
        .withCapacity(systemInfo.capacity)
        .saveDevice();

    mainPage.reloadPage();
    
     for(var i=0; i<= devicesCounter-1; i++){
        const devicesInfo = await mainPage.deviceCreatedExist(i);
        arraeglo.push(devicesInfo)
    //     //var device = await mainPage.getDevicesMainBox().nth(i).innerText
        
    //     //console.log("Total number of separate lines is: " + (await mainPage.getDevicesMainBox().nth(i).innerText).split(' ').length);
    //     if(i<3){
    //         //console.log(systemInfo[Object.keys(systemInfo)[i]]);
    //     }
    //     /* if(i<3){
    //         assertions
    //             .isTrue(await mainPage.getDevicesListNames().nth(i).withText(systemInfo[Object.keys(systemInfo)[i]]).visible);
    //     } */
     }
});

test('Rename First Device',async t =>{
    let deviceId;
    let firstDevice = await mainPage.returnDeviceNameText(0);

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
    assertions
        .isEqualsAsExpected(await mainPage.getDevicesListNames().nth(0).innerText,getFirstDevice.body.system_name,'Check device name is updated',5000)
});

test('Delete last device',async t =>{
    let deviceId;
    let lastDevice = await mainPage.returnDeviceNameText(-1);

    getAPIDevices.body.forEach(async device =>{
        if(device.system_name === lastDevice){
            deviceId = device.id;
        }
    });

    await t.request({
        url: `${process.env.URI}/${deviceId}`,
        method: "DELETE",
    });

    mainPage.reloadPage();
    await assertions
        .isFalse(await mainPage.getDevicesListNames().nth(-1).withText(lastDevice).exists,'Device is not deleted', 5000);  
});