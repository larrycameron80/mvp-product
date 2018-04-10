import React from 'react';

import Notifications from '../Notifications.js';
import * as M2Validator from '../../library/M2Validator';
import T, {t} from '../../components/Translate/Translate';

class AuthFormMain extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			email: '',
			password: '',
			errors: []
		}
	}

	__changeHandle(event) {
		var state = this.state;
		
		if(typeof state[event.target.name] !== "undefined") {
			state[event.target.name] = event.target.value;
			state.errors = [];
			this.setState(state);
		}
	}

	__formHandle(event) {
		event.preventDefault();
		let errors = [];
		if(!this.state.email || !M2Validator.isEmail(this.state.email)) {
			errors.push({
				type: 'm2error',
				title: 'Ошибка',
				text: 'Не корректно заполнено поле email'
			})
		}

		if(!this.state.password) {
			errors.push({
				type: 'm2error',
				title: 'Ошибка',
				text: 'Не корректно заполнено поле пароль'
			})
		}

		if(errors.lenth > 0) {
			this.setState({errors: errors});
		} else {
			this.props.authHandle(this.state.email, this.state.password);
		}
	}

	componentWillReceiveProps(p) {
		if(p.authFormMessages) {
			this.setState({errors: p.authFormMessages});
		}
	}

	render() {
		let errors = this.state.errors;
		let className = ['m2form_container', 'm2form_main_container', 'm2auth_form'];
		
		if(this.props.loading) {
			className.push('m2loading');
		}
        //
		// if(this.props.authFormMessages && this.props.authFormMessages.length > 0) {
		// 	errors = this.props.authFormMessages;
		// }

		return (
			<div className={className.join(' ')}>
				<Notifications items={errors}/>
				<form method="POST" onSubmit={this.__formHandle.bind(this)}>
					<div className="m2form_fields">
						<label><T ph="AUTH_INFO_1" def="Электронная почта"/></label>
						<input type="email" name="email" value={this.state.email} onChange={this.__changeHandle.bind(this)} placeholder={t("AUTH_INFO_2", "Например, i.ivanov@prototype.worldwifi.io")}/>
					</div>
					<div className="m2form_fields">
						<label><T ph="AUTH_INFO_3" def="Пароль"/></label>
						<input type="password" name="password" value={this.state.password} onChange={this.__changeHandle.bind(this)} placeholder={t("AUTH_INFO_4", "Например, ymTExB2VZgQX")}/>
					</div>
					<div className="m2form_row m2form_buttons">
						<button type="submit" className="m2btn m2btn-pr"><T ph="AUTH_INFO_5" def="Войти"/></button>
					</div>
				</form>
			</div>
		);
	}
}

export default AuthFormMain;