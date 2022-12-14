export class DeviceModel{
    constructor(name,type,capacity){
        this.name = name;
        this.type = type;
        this.capacity = capacity;
    }

    get deviceName(){
        return this.name;
    }

    get deviceType(){
        return this.type;
    }

    get deviceCapacity(){
        return this.capacity;
    }
}