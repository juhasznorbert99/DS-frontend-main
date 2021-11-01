import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    user: '/login'
};
function getUser(user, callback){
    let request = new Request(HOST.backend_api + endpoint.user,{
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });
    RestApiClient.performRequest(request,callback);
}

export {
    getUser
};