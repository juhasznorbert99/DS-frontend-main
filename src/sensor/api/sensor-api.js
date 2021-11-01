import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    sensor: '/sensor'
};

function getSensors(callback){
    let request = new Request(HOST.backend_api + endpoint.sensor, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}
function getSensor(id, callback) {
    let request = new Request(HOST.backend_api + endpoint.sensor + "/"+ id,{
        method: 'GET',
    });
    RestApiClient.performRequest(request,callback);
}

function postSensor(sensor, callback){
    let request = new Request(HOST.backend_api + endpoint.sensor + '/create', {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sensor)
    });
    console.log("URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}
function deleteSensor(id, callback) {
    let request =  new Request(HOST.backend_api + endpoint.sensor + "/delete/"+id,{
        method: 'DELETE',
    });
    RestApiClient.performRequest(request,callback);
}

function updateSensor(id, sensor, callback) {
    let request = new Request(HOST.backend_api+endpoint.sensor+"/update/"+id,{
        method: 'PUT',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sensor)
    });
    RestApiClient.performRequest(request,callback);
}


export {
    getSensors,
    postSensor,
    getSensor,
    deleteSensor,
    updateSensor
};