import * as UserActions from '../constants/user';
import * as API from '../models/UserModel';

export function auth(login, password) {
	return {
		type: "PROMISE",
		actions: [UserActions.START_AUTH_USER, UserActions.FINISH_AUTH_USER, UserActions.ERROR_AUTH_USER],
		promise: API.auth(login, password)
	}
}


export function registration(login, password, data) {
	return {
		type: "PROMISE",
		actions: [UserActions.START_REG_USER, UserActions.FINISH_REG_USER, UserActions.ERROR_AUTH_USER],
		promise: API.registration(login, password, data)
	}
}

export function loadList(filter, page) {
	return {
		type: "PROMISE",
		actions: [
			UserActions.START_LOAD_USERS_LIST,
			UserActions.FINISH_LOAD_USERS_LIST,
			UserActions.ERROR_LOAD_USERS_LIST
		],
		promise: API.loadUsers(filter, page)
	}
}

export function loadUserInfo(user_id) {
	return {
		type: "PROMISE",
		actions: [
			UserActions.START_LOAD_USER_INFO,
			UserActions.FINISH_LOAD_USER_INFO,
			UserActions.ERROR_LOAD_USER_INFO
		],
		promise: API.loadUserInfo(user_id)
	}
}


export function addUser(data) {
	return {
		type: "PROMISE",
		actions: [
			UserActions.START_ADD_USER,
			UserActions.FINISH_ADD_USER,
			UserActions.ERROR_ADD_USER
		],
		promise: API.addUser(data)
	}
}

export function updateUser(user_id, data) {
	return {
		type: "PROMISE",
		actions: [
			UserActions.START_UPDATE_USER,
			UserActions.FINISH_UPDATE_USER,
			UserActions.ERROR_UPDATE_USER
		],
		promise: API.updateUser(user_id, data)
	}
}

export function removeUser(id) {
	return {
		type: "PROMISE",
		actions: [
			UserActions.START_DELETE_USER,
			UserActions.FINISH_DELETE_USER,
			UserActions.ERROR_DELETE_USER,
		],
		promise: API.removeUser(id)
	}
}

export function loadUsersLists() {
	return {
		type: "PROMISE",
		actions: [
			UserActions.START_LOAD_ULIST,
			UserActions.FINISH_LOAD_ULIST,
			UserActions.ERROR_LOAD_ULIST,
		],
		promise: API.loadUserLists()
	}
}