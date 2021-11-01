import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    device: '/device'
};

function postDevice(device, callback){
    let request = new Request(HOST.backend_api + endpoint.device + '/create', {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device)
    });
    console.log("URL: " + request.url);
    console.log(JSON.stringify(device));
    RestApiClient.performRequest(request, callback);
}
function getDevices(callback){
    let request = new Request(HOST.backend_api + endpoint.device, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function deleteDevice(id, callback){
    let request =  new Request(HOST.backend_api + endpoint.device + "/delete/"+id,{
        method: 'DELETE',
    });
    RestApiClient.performRequest(request,callback);
}

function getDevice(id, callback){
    let request = new Request(HOST.backend_api + endpoint.device + "/"+ id,{
        method: 'GET',
    });
    RestApiClient.performRequest(request,callback);
}
function updateDevice(id, device, callback){
    let request = new Request(HOST.backend_api+endpoint.device+"/update/"+id,{
        method: 'PUT',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device)
    });
    RestApiClient.performRequest(request,callback);
}

export {
    postDevice,
    getDevices,
    deleteDevice,
    getDevice,
    updateDevice
};