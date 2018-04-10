import * as Config from '../config';
import M2Request from '../library/M2Request';

const Endpoints = {
    'get_lists': Config.API_URL + 'lists/',
    'get_lists_items': Config.API_URL + 'lists/',
    'update': Config.API_URL + 'lists/'
};


export function LoadLists() {
    return M2Request(Endpoints.get_lists, "GET");
}

export function loadListsItems(alias) {
    return M2Request(Endpoints.get_lists_items + alias, "GET");
}

export function updateList(alias, data) {
    return M2Request(Endpoints.update + alias, "POST", {}, {items: data});
}