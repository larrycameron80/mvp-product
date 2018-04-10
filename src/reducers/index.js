//файл для комбинирования редьюсеров

import * as AppActions from '../actions';
import { routerReducer as routing  } from 'react-router-redux';
import { combineReducers } from 'redux';

//import applicatoin reducers
import UserReducer from './UserReducer';
import StatReducer from './StatReducer';
import CampaignReducer from './CampaignReducer';
import PlatformReducer from './PlatformReducer';
import BillReducer from './BillReducer';
import GroupReducer from './GroupReducer';
import ListReducer from './ListReducer';
import TranslationReducer from './TranslationsReducer';
import CoorpReducer from './CoorpReducer';
import NotificationReducer from './NotificationReducer';

//applicaton error reducer
const AppErrors = (state = null, action) => {
	const {action_type, error} = action;

	if (action_type === AppActions.RESET_ERROR_MESSAGE) {
		return null;
	} else {
		if (error) {
			return error;
		}
	}

	return state;
}


const ApplicationReducer = combineReducers({
	UserReducer,
    ListReducer,
	TranslationReducer,
    NotificationReducer,
	routing
});

export default ApplicationReducer;