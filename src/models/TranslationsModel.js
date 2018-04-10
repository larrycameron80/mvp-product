import * as Config from '../config';
import M2Request from '../library/M2Request';

const Endpoints = {
    'get_langs_list': Config.API_URL + 'translate/lang/admin',
    'del_lang': Config.API_URL + 'translate/lang/',
    'post_lang': Config.API_URL + 'translate/lang/',
    'put_lang': Config.API_URL + 'translate/lang/',
    'get_phs': Config.API_URL + 'translate/lang/',
    'put_ph': Config.API_URL + 'translate/ph/',
};

/*загрузка списка языков*/
export function loadLangs() {
    return M2Request(Endpoints.get_langs_list, "GET");
}

/*удаление языка*/
export function deleteLang(langID) {
    return M2Request(Endpoints.del_lang + langID, "DELETE");
}

/*добавление языка*/
export function addLang(data) {
    return M2Request(Endpoints.post_lang, "POST", {}, data);
}

/*обновление языка*/
export function updateLang(langID, data) {
    return M2Request(Endpoints.put_lang + langID, "PUT", {}, data);
}

/*загрузка пх*/
export function loadPhs(langID) {
    return M2Request(Endpoints.get_phs + langID, "GET");
}

/*обновление пх*/
export function updatePh(phID, data) {
    return M2Request(Endpoints.put_ph + phID, "PUT", {}, {values: data});
}