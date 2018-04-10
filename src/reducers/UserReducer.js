import * as UserActions from '../constants/user';


export default function UserReducer(state = [], action) {
	switch(action.type) {

		case UserActions.START_REG_USER: return {state: action.type, data: action.data || {}};
		case UserActions.FINISH_REG_USER: return {state: action.type, data: action.data || {}};
		case UserActions.ERROR_REG_USER: return {state: action.type, data: action.data || {}};

		case UserActions.START_AUTH_USER: return {state: action.type, data: action.data || {}};
		case UserActions.FINISH_AUTH_USER: return {state: action.type, data: action.data || {}};
		case UserActions.ERROR_AUTH_USER: return {state: action.type, data: action.data || {}};
		
		/*load user list*/
		case UserActions.START_LOAD_USERS_LIST: return {state: action.type, data: action.data || {}};
		case UserActions.FINISH_LOAD_USERS_LIST: return {state: action.type, data: action.data || {}};
		case UserActions.ERROR_LOAD_USERS_LIST: return {state: action.type, data: action.data || {}};

		/*get user*/
		case UserActions.START_LOAD_USER_INFO: return {state: action.type, data: action.data || {}};
		case UserActions.FINISH_LOAD_USER_INFO: return {state: action.type, data: action.data || {}};
		case UserActions.ERROR_LOAD_USER_INFO: return {state: action.type, data: action.data || {}};

		/*add user*/
		case UserActions.START_ADD_USER: return {state: action.type, data: action.data || {}};
		case UserActions.FINISH_ADD_USER: return {state: action.type, data: action.data || {}};
		case UserActions.ERROR_ADD_USER: return {state: action.type, data: action.data || {}};
		
		/*remove user*/
		case UserActions.START_DELETE_USER: return {state: action.type, data: action.data || {}};
		case UserActions.FINISH_DELETE_USER: return {state: action.type, data: action.data || {}};
		case UserActions.ERROR_DELETE_USER: return {state: action.type, data: action.data || {}};

		/*update user*/
		case UserActions.START_UPDATE_USER: return {state: action.type, data: action.data || {}};
		case UserActions.FINISH_UPDATE_USER: return {state: action.type, data: action.data || {}};
		case UserActions.ERROR_UPDATE_USER: return {state: action.type, data: action.data || {}};

		/*load users lists*/
		case UserActions.START_LOAD_ULIST: return {state: action.type, data: action.data || {}};
		case UserActions.FINISH_LOAD_ULIST: return {state: action.type, data: action.data || {}};
		case UserActions.ERROR_LOAD_ULIST: return {state: action.type, data: action.data || {}};

		default: return state;
	}
}