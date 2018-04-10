import * as Config from '../config';
import M2Request from '../library/M2Request';

const Endpoints = {
    "get": Config.API_URL + 'notifications/',
    "get_template": Config.API_URL + 'notifications/',
    "update_code": Config.API_URL + 'notifications/',
}


export function getTemplate(alias, lang) {
    let url = Endpoints.get_template;
    url += alias;
    if(lang) url += '?lang=' + lang;
    return M2Request(url, "GET");
}

export function loadList() {
    return M2Request(Endpoints.get, "GET");
}

export function updateTemplate(alias, lang, code, title) {
    let url = Endpoints.update_code;
    url += alias;
    if(lang) url += '?lang=' + lang;
    return M2Request(url, "PUT", {}, {code: code, title: title});
}