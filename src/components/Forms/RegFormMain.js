import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

import T, {t} from '../../components/Translate/Translate';
import Notifications from '../Notifications.js';
import { RECAPTCHA_KEY } from '../../config';
import * as M2Validator from '../../library/M2Validator';

class RegFormMain extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			company: '',
			position: '',
			tel: '',
			email: '',
			password: '',
			password_repeat: '',
			placeholder_password: this.randomPassword(),
			errors: []
		}
	}


	__handlerChange(event) {
		event.preventDefault();
		let state = this.state;
		state[event.target.name] = event.target.value;
		state.errors = [];
		this.setState(state);
	}

	__handleSubmit(event) {
		event.preventDefault();
		let componentState = this.state;
		componentState.errors = [];
		
		if(componentState.password !== componentState.password_repeat) {
			componentState.errors.push({
				type: 'm2error',
				title: 'Ошибка',
				text: 'Введенные пароли не совпадают'
			});
		}

		if(componentState.position == '') {
			componentState.errors.push({
				type: 'm2error',
				title: 'Ошибка',
				text: 'Выберете пожалуйста роль'
			});
		}

		if(!M2Validator.isEmail(componentState.email)) {
			componentState.errors.push({
				type: 'm2error',
				title: 'Ошибка',
				text: 'Введенн не корректный email'
			});
		}

		//if(window.grecaptcha && window.grecaptcha.getResponse() && window.grecaptcha.getResponse().length == 0) {
		//	componentState.errors.push({
		//		type: 'm2error',
		//		title: 'Ошибка',
		//		text: 'Не верное введена captcha'
		//	});
		//}

		this.setState(componentState);

		if(componentState.errors.length == 0) {
			this.props.regUser(this.state);
		}
	}


	randomPassword() {
		return (Math.random().toString(36)).substr(2, 10);
	}

	componentDidMount() {
		$(document).ready(function() {
			if(window.grecaptcha && $('#m2_main_reg').length > 0){
				window.grecaptcha.render('m2_main_reg', {
					'sitekey': RECAPTCHA_KEY
				});
			}
		});
	}

	componentWillReceiveProps(p) {
		if(p.regFormMessages && p.regFormMessages.length > 0) {
			this.setState({errors: p.regFormMessages})
		}
	}


	render() {
		let info = this.state;
		let className = ['m2form_container', 'm2form_main_container'];
		let errors = this.state.errors;

		// if(this.props.regFormMessages && this.props.regFormMessages.length > 0){
		// 	errors = this.props.regFormMessages;
		// }

		if(this.props.loading) {
			className.push('m2loading');
		}


		return (
			<div className={className.join(' ')}>
				<Notifications items={errors}/>
				<form method="POST" onSubmit={this.__handleSubmit.bind(this)}>
					{(typeof this.props.title == "undefined" || this.props.title == true) ? <div className="m2form_title"><T ph="REG_FORM_INFO_1" def="Готовы зарабатывать?"/></div> : ''}
					<div className="m2form_fields">
						<div className="m2form_row">
							<div className="m2form_col">
								<label><T ph="REG_FORM_INFO_2" def="Название вашей компании"/></label>
								<input required type="text" value={info.company} onChange={this.__handlerChange.bind(this)} name="company" placeholder={t('REG_FORM_INFO_3', 'Ваша компания')}/>
							</div>
							<div className="m2form_col">
								<label><T ph="REG_FORM_INFO_4" def="Вы региструетесь как"/></label>
								<div className="m2select_column">
									<select value={info.position} onChange={this.__handlerChange.bind(this)} name="position" size="1">
										<option value="">{t('REG_FORM_INFO_5', 'Выберите кем будете')}</option>
										<option value="owner">{t('REG_FORM_INFO_6', 'Владелец площадки')}</option>
										<option value="client">{t('REG_FORM_INFO_7', 'Выберите кем будетеРекламодатель')}</option>
									</select>
								</div>
							</div>
						</div>
						<div className="m2form_row">
							<div className="m2form_col">
								<label><T ph="LBL_PHONE" def="Телефон" /></label>
								<input required type="tel" value={info.tel} onChange={this.__handlerChange.bind(this)} name="tel" placeholder={t('REG_FORM_INFO_8', 'Ваш телефон')}/>
							</div>
							<div className="m2form_col">
								<label><T ph="REG_FORM_INFO_9" def="Электронная почта"/></label>
								<input required type="email" value={info.email} onChange={this.__handlerChange.bind(this)} name="email" placeholder={t('REG_FORM_INFO_10', 'Ваш email')}/>
							</div>
						</div>
						<div className="m2form_row">
							<div className="m2form_col">
								<label><T ph="LBL_PASSWORD" def="Пароль" /></label>
								<input required type="password" value={info.password} onChange={this.__handlerChange.bind(this)} name="password" placeholder={t("LBL_PASSWORD_PH", "Введите пароль")}/>
							</div>
							<div className="m2form_col">
								<label><T ph="LBL_PASSWORD_REPEAT_PH" def="Пароль еще раз" /></label>
								<input required type="password" value={info.password_repeat} onChange={this.__handlerChange.bind(this)} name="password_repeat" placeholder={t("LBL_PASSWORD_REPEAT_PH", "Введите пароль еще раз")}/>
							</div>
						</div>
						<div className="m2form_row m2form_note">
							<T ph="REG_FORM_INFO_11" def="Нажимая кнопку «Зарегистрироваться» вы соглашаетесь с"/> <Link to="/offert"><T ph="REG_FORM_INFO_12" def="условиями оферты"/></Link> <T ph="REG_FORM_INFO_13" def="сервиса."/>
						</div>
						<div className="m2form_row m2form_buttons">
							<div className="m2form_captcha" id="m2_main_reg"></div>
							<button type="submit" className="m2btn m2btn-pr"><T ph="REG_FORM_INFO_14" def="Зарегистрироваться"/></button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default RegFormMain;