import * as Config from '../config';
import M2Request from '../library/M2Request';


const Endpoints = {
    "get" : Config.API_URL + 'groups/',
    "get_one" : Config.API_URL + 'groups/',
    "add" : Config.API_URL + 'groups/',
    "delete" : Config.API_URL + 'groups/',
    "update" : Config.API_URL + 'groups/',
}


export function loadList() {
    return M2Request(Endpoints.get, "GET");
}

export function loadInfo(id) {
    return M2Request(Endpoints.get_one + id, "GET");
}

export function addGroup(data) {
    return M2Request(Endpoints.add, "POST", {}, data);
}

export function updateGroup(id, data) {
    return M2Request(Endpoints.update + id, "PUT", {}, data);
}

export function deleteGroup(id) {
    return M2Request(Endpoints.delete + id, "DELETE");
}