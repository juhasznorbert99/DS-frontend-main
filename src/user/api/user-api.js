import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    user: '/user'
};

function postUser(user, callback){
    let request = new Request(HOST.backend_api + endpoint.user + '/create', {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });
    console.log("URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}
function getClients(callback){
    let request = new Request(HOST.backend_api + endpoint.user, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function deleteUser(id, callback){
    let request =  new Request(HOST.backend_api + endpoint.user + "/delete/"+id,{
        method: 'DELETE',
    });
    RestApiClient.performRequest(request,callback);
}

function getUser(id, callback){
    let request = new Request(HOST.backend_api + endpoint.user + "/"+ id,{
        method: 'GET',
    });
    RestApiClient.performRequest(request,callback);
}
function updateUser(id, user, callback){
    let request = new Request(HOST.backend_api+endpoint.user+"/update/"+id,{
        method: 'PUT',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });
    RestApiClient.performRequest(request,callback);
}
export {
  postUser,
  getClients,
  deleteUser,
  getUser,
  updateUser
};