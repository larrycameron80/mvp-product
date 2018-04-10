// региструем роуты и рендерим наш компонент с redux-provider
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router } from 'react-router'

import Routes from '../routes';


const M2Core = ({store, history}) => (
	<Provider store={store}>
		<div className="m2Application">
			<Router history={history} routes={Routes} />
		</div>
	</Provider>
);


M2Core.propTypes = {
	store: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};


export default M2Core;