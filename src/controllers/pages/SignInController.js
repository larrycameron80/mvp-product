import React from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Config from '../../config';
import Header from '../../components/Header';
import RegFormMain from '../../components/Forms/RegFormMain';
import AuthFormMain from '../../components/Forms/AuthFormMain';
import FooterScripts from '../../components/FooterScripts';
import * as UserActions from '../../actions/users';
import M2Store from '../../library/M2Store';
import T, {t} from '../../components/Translate/Translate';

const Store = new M2Store();

class SignInController extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: 'reg',
			errors: [],
			errors_auth: []
		};



        document.title = t('TITLE_PAGE_REGISTRATION', 'Регистрация в сервисе World WiFi');
	}

	componentWillUpdate(){

	}


	regFormSubmit(data) {
		this.props.actions.registration(data['email'], data['password'], data);
	}

	authFormSubmit(login, password) {
		this.props.actions.auth(login, password);
	}


	setRegActive(event) {
		event.preventDefault();
		this.setState({active: 'reg'});
        document.title = t('TITLE_REGISTRATION_PAGE','Регистрация в сервисе World WiFi');
	}

	setAuthActive(event) {
		event.preventDefault();
		this.setState({active: 'auth'});
        document.title = t('TITLE_SINGIN_PAGE', 'Авторизация в сервисе World WiFi');
	}

	componentWillReceiveProps(p) {
		if(p.answer && p.answer.state) {
            let errors = [], errors_auth = [];
			switch(p.answer.state) {
				case 'ERROR_AUTH_USER':

                    errors_auth.push({
                        type: 'm2error',
                        title: 'Ошибка авторизации',
                        text: 'Неверный логин или пароль'
                    });
					this.setState({errors_auth: errors_auth});
					break;
				case 'FINISH_AUTH_USER':
					errors.push({
                        'type': 'm2success',
                        'title': 'Авторизация прошла успешно',
                        'text': 'Через несколько минут вы будете преадресованы на личный кабинет'
                    });
					this.setState({errors_auth: errors_auth});
					break;

				case 'FINISH_REG_USER':
					if(p.answer.data.result == 'error') {
						errors.push({
                            type: 'm2error',
                            title: 'Ошибка регистрации',
                            text: 'Пользователь с данным email уже зарегистрирован'
                        });
						this.setState({errors: errors});
					} else {
						errors.push({
                            type: 'm2success',
                            title: 'Вы успешно зарегистрированы',
                            text: 'Вы может войти в личный кабинет под своими регистрационными данными'
                        });
						this.setState({errors: errors});
					}
					break;

				case 'ERROR_REG_USER':
					errors.push({
                        type: 'm2error',
                        title: 'Ошибка регистрации',
                        text: this.props.answer.data.data
                    });
					this.setState({errors: errors});
					break;
			}
		}
	}


	render() {
		var regFormMessages = [], authFormMessages = [];
		var regFormLoading = false, authFormLoading = false;

		if(this.props.answer.state == 'START_REG_USER' || this.props.answer.state == 'START_AUTH_USER') {
			regFormLoading = true;
			authFormLoading = true;
		}

		if(this.props.answer.state == 'ERROR_AUTH_USER') {
			authFormLoading = false;

		}

		if(this.props.answer.state == 'FINISH_AUTH_USER') {
			authFormLoading = false;

			Store.set('access_token', this.props.answer.data.access_token);
			Store.set('info', JSON.stringify(this.props.answer.data.info));
			let info = this.props.answer.data.info;
			if(info.group && info.group.alias) {
				switch(info.group.alias) {
					case "admin": browserHistory.push("/admin"); break;
					default: browserHistory.push("/cp"); break;
				}
			}
		}

		if(this.props.answer.state == 'FINISH_REG_USER') {
			regFormLoading = false;
		}

		if(this.props.answer.state == 'ERROR_REG_USER') {
			regFormLoading = false;

		}


		return (
			<div className="m2page_controller">
				<Header navigation={Config.STATIC_PAGES} langs={Config.LANGS}/>
				<main className="m2page_row m2page m2static_page">
					<section className="m2page_row m2page_row_center m2row_pr" data-scroll="section1">
						<div className="m2content_static m2content_page m2signin">
							<div className="m2tabs">
								<div className="m2tabs_navs">
									<Link href="#" onClick={this.setRegActive.bind(this)} className={this.state.active == 'reg' ? 'active' : ''}><T ph="SING_IN_INFO_1" def="Регистрация"/></Link>
									<Link href="#" onClick={this.setAuthActive.bind(this)} className={this.state.active == 'auth' ? 'active' : ''}><T ph="SING_IN_INFO_2" def="Авторизация"/></Link>
								</div>
								<div className="m2tabs_content">
									{this.state.active == 'reg' ? <RegFormMain loading={regFormLoading} regFormMessages={this.state.errors} regUser={this.regFormSubmit.bind(this)} title={false}/> : <AuthFormMain loading={authFormLoading} authFormMessages={this.state.errors_auth} authHandle={this.authFormSubmit.bind(this)}/>}
								</div>
							</div>
						</div>
					</section>
					<FooterScripts/>
					<footer className="m2page_row">
						<p><T ph="LANDING_FOOTER_1" def="2018 - World WiFi. Все права защищены"/></p>
						<p><T ph="LANDING_FOOTER_2" def="Любое несанкционированное копирование материалов сайта карается законом."/></p>
					</footer>
				</main>
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
)(SignInController);