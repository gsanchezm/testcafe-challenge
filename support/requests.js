import {t} from 'testcafe'

export class Requests{
   
    async getDevice(endPoint){
        await t.request({
            url: endPoint,
            method: "GET",
        });
    }

    async #deleteDevice(endPoint){
        await t.request({
            url: endPoint,
            method: "DELETE",
        });
    }

    async #updateDevice(endPoint,jsonBody){
        await t.request({
            url: endPoint,
            method: "PUT",
            body : jsonBody,
        }); 
    }

    async httpRequest(httpreq,endpoint,jsonBody=''){
        console.log("HTTP Request Selected")
        const http = {
            GET: getDevice(endpoint),
            UPDATE: updateDevice(endpoint,jsonBody),
            DELETE: deleteDevice(endpoint)
        }

        return await http[httpreq];
    }
}

export const requests = new Requests();