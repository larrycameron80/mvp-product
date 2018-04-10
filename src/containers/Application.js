// компонент отвечающий за рендеринг приложения, представляет из себя контейнер, который привязан к роуту, используется для раздление логики  (например различные виды кабинетов)
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { resetErrorMessage } from '../actions/errors';

import M2Request from '../library/M2Request';
import M2Store from '../library/M2Store';
import * as M2UserActions from '../models/UserModel';
import * as Config from '../config';
const Store = new M2Store();


class Application extends React.Component {
	static propTypes = {
		errorMessage: PropTypes.string,
		resetErrorMessage: PropTypes.func.isRequired,
		children: PropTypes.node
	};

	constructor(props) {
		super(props);
		this.state = {
			lang_loaded: false
		}
	}

	__reloadUserInfo() {
		M2UserActions.loadSelfInfo().then(function(res){

			if(res && res.data && res.data.result == 'success') {
				let info = res.data.info;
				Store.set('info', JSON.stringify(info));
			}
		}).catch(function(err){
			
		});
	}

	__getLocaleList() {
		let self = this;
		M2Request(Config.API_URL + 'translate/lang/', 'GET').then(function (res) {
			window.tr = res.data.data;
			self.setState({lang_loaded: true});
		})
	}

	__getLocaleFile() {
	}

	componentDidUpdate() {
		if(Store.get('info')) {
			this.__reloadUserInfo();
		}
	}

	componentDidMount() {
		// получить локаль пользователя, если нет - дефолтную
		// фнукция загрузки плейсхолдеров по lang name = ru
		// проставить состояние что пх загрузились this.setState({}) && window.translations и положить в локал стор
		this.__getLocaleList();
		let self = this;
		if(window.location.href.indexOf('/admin') + 1 > 0 || window.location.href.indexOf('/cp') + 1 > 0) {
			if(!Store.get('info')) {
				window.location.href = '/signin';
			} else {
				let user_info = JSON.parse(Store.get('info'));
				if(window.location.href.indexOf('/admin') + 1 > 0 && user_info.group.alias != "admin") {
					window.location.href = '/cp';
				} else {
					if(window.location.href.indexOf('/cp') + 1 > 0 && user_info.group.alias == 'admin') {
						window.location.href = '/admin';
					} else {
                        this.__reloadUserInfo();
					}
				}
				//this.__reloadUserInfo();
			}
			
		}
		
	}

	render() {
		const { children } = this.props;
		return (
			<div className="m2AppContainer">
				{this.state.lang_loaded && children}
			</div>
		)
	}
}



const mapStateToProps = (state, ownProps) => ({
	errorMessage: state.errorMessage,
	inputValue: ownProps.location.pathname.substring(1)
});

export default connect(mapStateToProps, {
	resetErrorMessage
})(Application);