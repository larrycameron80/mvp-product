// Контроллер главной страницы
import React from 'react';
import Particles from 'react-particles-js';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery';


import * as Config from '../config';
import Header from '../components/Header';
import Map from '../components/map/Map';
import RegFormMain from '../components/Forms/RegFormMain';
import ScrollPagination from '../components/ScrollPagination';
import FooterScripts from '../components/FooterScripts';
import * as UserActions from '../actions/users';
import * as M2Format from '../library/M2Format';
import T, {t} from '../components/Translate/Translate';

class MainController extends React.Component {

	constructor(props) {
		super(props);
		this.prConfig = Config.PRJS;
		this.init = false;
		this.state = {
			campaigns: 18503
		}

		document.title = t('TITLE_MAIN_PAGE', 'World WiFi');
	}

	getRandom(max, min) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}

	componentDidMount() {
		this.init = true;
		var component = this;
		setInterval(function(){
			if(component.init){
				let new_count = component.getRandom(1, 5) + component.state.campaigns;
				component.setState({campaigns: new_count});
			}
		}, 2500);

	}

	componentWillUnmount() {
		this.init = false;
	}

	regFormSubmit(data) {
		this.props.actions.registration(data['email'], data['password'], data);
	}

	__scrollToAbout(event) {
		event.preventDefault();
		$('html, body').animate({scrollTop: $('#aboutScroll').offset().top + 200}, 300);
	}
	__scrollToReg(event) {
		event.preventDefault();
		$('html, body').animate({scrollTop: $('#regFromScroll').offset().top + 200}, 300);
	}
	render() {
		let svgPlayIcon = '<use xlink:href="#svg_icon_play"></use>';
		var regFormMessages = [];
		var regFormLoading = false;


		
		if(this.props.answer.state == 'START_REG_USER') {
			regFormLoading = true;
		}

		if(this.props.answer.state == 'FINISH_REG_USER') {
			regFormLoading = false;
			if(this.props.answer.data.result == 'error') {
				regFormMessages.push({
					type: 'm2error',
					title: 'Ошибка регистрации',
					text: 'Пользователь с данным email уже зарегистрирован'
				});
			} else {
				regFormMessages.push({
					type: 'm2success',
					title: 'Вы успешно зарегистрированы',
					text: 'Вы может войти в личный кабинет под своими регистрационными данными'
				});
			}
		}

		if(this.props.answer.state == 'ERROR_REG_USER') {
			regFormLoading = false;
			regFormMessages.push({
				type: 'm2error',
				title: 'Ошибка регистрации',
				text: this.props.answer.data.data
			})
		}
	
		return (
			<div className="m2page_controller">
				<ScrollPagination />
				<Header navigation={Config.STATIC_PAGES} langs={Config.LANGS}/>
				<Content />
			</div>
		);
	}
}

const mapStateToProps = state => ({
	answer: state.UserReducer
});

const mapDispatchProps = dispatch => ({
	actions: bindActionCreators(UserActions, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchProps
)(MainController);