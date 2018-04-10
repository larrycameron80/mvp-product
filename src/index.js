/*
	Старт приложения, подгружает хранилку, редукс + рендерит в элемент с id=m2Core
*/
import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';



// загружаем корневой компонент
import M2Core from './containers/M2Core';
//загружаем хранилку
import ApplicationCreateStore from './store/index';


// инициализируем хранилку
const AppStore = ApplicationCreateStore();
// инициализируем привязку хранилки к browser history (htmlHistoryAPI)
const AppHistory = syncHistoryWithStore(browserHistory, AppStore);


// load styles
require('./styles/main.css');

// рендирим корневой компонент
render(<M2Core store={AppStore} history={AppHistory} />, document.getElementById('m2Core'));