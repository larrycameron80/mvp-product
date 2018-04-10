// production среда для хранлища, отличие от dev состоит в том, что не подгражем дебаггеры и логгеры
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';


import AppReducer from '../reducers/';
import ApiMiddleWare from '../middleware/api';


//create application store
const AppStore = preloadedState => createStore(
	AppReducer,
	preloadedState,
	applyMiddleware(thunk, ApiMiddleWare)
);

export default AppStore;