import * as Config from '../config';
import M2Request from '../library/M2Request';

const Endpoints = {
	'auth': Config.API_URL + 'user/token',
	'add': Config.API_URL + 'user',
	
	'delete': Config.API_URL + 'user/',
	'update': Config.API_URL + 'user/',
	'self': Config.API_URL + 'user/self_info',
	'get': Config.API_URL + 'user/list',
	'get_user': Config.API_URL + 'user/',
	'add_user': Config.API_URL + 'user/add',
	'items': Config.API_URL + 'public/user_lists'
}


export function loadSelfInfo() {

	return M2Request(Endpoints.self, "GET");
}

export function loadUserLists() {
	return M2Request(Endpoints.items, "GET");
}


export function auth(login, password) {
	let data = {
		'username': login, 
		'password': password,
		'grant_type': 'password',
		'client_id': login,
		'client_secret': password 
	};

	return M2Request(Endpoints.auth, "POST", {}, data)
}


export function registration(login, password, data) {
	data['login'] = login;
	data['password'] = password;
	return M2Request(Endpoints.add, "POST", {}, data);
}

export function loadUsers(filter, page) {
	let url = Endpoints.get;
	let params = [];
	if(page) {
		url += '?page=' + page;
	}

	if(filter && filter.name) params.push('name=' + filter.name);
	if(filter && filter.email) params.push('email=' + filter.email);
	if(filter && filter.phone) params.push('phone=' + filter.phone);
	if(filter && filter.status) params.push('status=' + filter.status);

	if(params.length > 0) {
		url += '&' + params.join('&');
	}


	return M2Request(url, "GET", {}, filter);
} 

export function loadUserInfo(id) {
	return M2Request(Endpoints.get_user + id,'GET');
}

export function addUser(data) {
	return M2Request(Endpoints.add_user,'POST', {}, data);
}

export function updateUser(id, data) {
	return M2Request(Endpoints.update + id,'PUT', {}, data);
}

export function removeUser(id) {
	return M2Request(Endpoints.delete + id, "DELETE");
}