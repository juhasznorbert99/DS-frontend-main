import {HOST} from "../../commons/hosts";
import RestApiClient from "../../commons/api/rest-client";
const endpoint = {
    sensor: '/sensorData'
};

function getSensorDatas(callback){
    let request = new Request(HOST.backend_api + endpoint.sensor, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}
function getSensorData(id, callback) {
    let request = new Request(HOST.backend_api + endpoint.sensor + "/"+ id,{
        method: 'GET',
    });
    RestApiClient.performRequest(request,callback);
}

function deleteSensorData(id, callback) {
    let request =  new Request(HOST.backend_api + endpoint.sensor + "/delete/"+id,{
        method: 'DELETE',
    });
    RestApiClient.performRequest(request,callback);
}
export {
    deleteSensorData,
    getSensorDatas,
    getSensorData
};