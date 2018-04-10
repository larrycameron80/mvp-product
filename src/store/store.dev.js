// dev redux хранилище
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'

// загржаем редьюсеры
import AppReducer from '../reducers/';
import DevTools from '../containers/DevTools';
// загружаем middleware для обработки 
import ApiMiddleWare from '../middleware/api';


//create application store

const AppStore = preloadedState => {

	//создаем хранище
	const store = createStore(
		AppReducer,
		preloadedState,
		compose(
			applyMiddleware(thunk, ApiMiddleWare, createLogger()),
			DevTools.instrument()
		)
	);


	// если сборщик поддерживает hot-reload то пробуем подгрузить нужные redusers
	if(module.hot) {
		module.hot.accept('../reducers', () => {
			const nextReducer = require('../reducers').default;
			store.replaceReducer(nextReducer);
		});
	}

	return store;
}

export default AppStore;