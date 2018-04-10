import React from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery';

import M2Store from '../../library/M2Store';
import T, {t} from '../../components/Translate/Translate';
import * as Config from '../../config';
import Header from '../../components/Cabinet/Header';
import NavControlls from '../../components/Admin/NavControlls';
import Filter from '../../components/Cabinet/Filter';
import Items from '../../components/Cabinet/Items';
import Notifications from '../../components/Notifications';
import * as UserActions from '../../actions/users';
import FormGenerator from '../../components/FormGenerator';

const Storage = new M2Store();

class Edit extends React.Component {
	constructor(props) {
		super(props);
		let id = 0;
		let group = 'client';
		if(Storage.get('info')) {
			let balance = JSON.parse(Storage.get('info'));
			id = balance.user_id;
			group = balance.group.alias;
		}
        document.title = t('TITLE_PROFILE_EDIT', 'Редактирование профиля');

		this.state = {
			group: group,
			id: id,
			fio: '',
			email: '',
			password: '',
			password_repeat: '',
			phone: '',
			notification_types: '',
			alert_types: '',
			org_name: '',
			country_id: '',
			city_id: '',
			street: '',
			house: '',
			company_inn: '',
			company_kpp: '',
			company_adress: '',
			company_rs: '',
			company_cors: '',
			company_bank: '',
			company_bik: '',
			user_rule: '',
			status: '',
			section: '',
			house_section: '',
            lang_id: '',
			langs_list: {},
			errors: [],
			rule_list: {},
			country_list: {},
			city_list: {}
		}
	}

	__updateLang(value) {
		this.setState({lang_id: value});
	}

	__updatePhone(value) {
		this.setState({phone: value});
	}

	__updateHouseSection(value) {
		this.setState({house_section: value});
	}

	__updateSection(value){
		this.setState({section: value});
	}

	__updateHouse(value) {
		this.setState({house: value});
	}


	__updateStreet(value) {
		this.setState({street: value});
	}

	__updateCKpp(value) {
		this.setState({company_kpp: value});
	}
	__updateCAdress(value) {
		this.setState({company_adress: value});
	}
	__updateCRs(value) {
		this.setState({company_rs: value});
	}
	__updateCRS(value) {
		this.setState({company_cors: value});
	}
	__updateCBank(value) {
		this.setState({company_bank: value});
	}
	__updateCBik(value) {
		this.setState({company_bik: value});
	}
	__updateCRule(value) {
		this.setState({user_rule: value});
	}
	__updateCActive(value) {
		this.setState({status: value});
	}


	__updateCInn(value) {
		this.setState({company_inn: value});
	}

	__updateCountry(country) {
		this.setState({country_id: country});
	}

	__updateCity(city){
		this.setState({city_id: city});
	}

	__updateOrgName(value) {
		this.setState({org_name: value});
	}

	__updateAlertTypes(val) {
		this.setState({alert_types: val});
	}

	__updateNotificationTypes(val) {
		this.setState({notification_types: val});
	}

	__updatePassword(value) {
		this.setState({password: value});
	}

	__updatePasswordRepeat(value) {
		this.setState({password_repeat: value});
	}

	__updateFio(value) {
		this.setState({fio: value});
	}

	__updateEmail(value) {
		this.setState({email: value});
	}


	__formSubmit(event) {
		event.preventDefault();
		let nofitications = [];
		let user_name = this.state.fio.split(' ');
		let form_data = {
			first_name: user_name[1] || '',
			second_name: user_name[0] || '',
			third_name: user_name.slice(2, user_name.length).join(' ') || '',
			email: this.state.email,
		
			notification_types: this.state.notification_types,
			alert_types: this.state.alert_types,
			org_name: this.state.org_name,
			country_id: this.state.country_id,
			city_id: this.state.city_id,
			street: this.state.street,
			house: this.state.house,
			company_inn: this.state.company_inn,
			company_kpp: this.state.company_kpp,
			company_adress: this.state.company_adress,
			company_rs: this.state.company_rs,
			company_cors: this.state.company_cors,
			company_bank: this.state.company_bank,
			company_bik: this.state.company_bik,
			user_rule: this.state.user_rule,
			status: this.state.status,
			section: this.state.section,
			house_section: this.state.house_section,
			phone: this.state.phone,
			lang_id: this.state.lang_id
		};

		if(this.state.password != '' || this.state.password_repeat != '') {
			form_data.password = this.state.password;
			form_data.password_repeat = this.state.password_repeat;
			if(form_data.password != form_data.password_repeat) {
				nofitications.push({
					type: 'm2error',
					title: 'Ошибка добавления пользователя',
					text: 'Введенные пароли не совпадают'
				});
			}
		}

		

		if(nofitications.length > 0) {
			this.setState({
				errors: nofitications
			});
		} else {
			this.props.actions.updateUser(this.state.id, form_data);
		}
	}


	componentDidMount() {
		this.props.actions.loadUsersLists();
		this.props.actions.loadUserInfo(this.state.id);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.answer) {
			if(nextProps.answer.state == 'FINISH_LOAD_ULIST' && nextProps.answer.data.result !== "error") {
				let country_list = {}, city_list = {};
				country_list = nextProps.answer.data.country_list;
                city_list = nextProps.answer.data.city_list;
				// nextProps.answer.data.country_list.map(item => country_list[item.id] = item.name);
				// nextProps.answer.data.city_list.map(item => city_list[item.id] = item.name);
				this.setState({
					rule_list: nextProps.answer.data.groups,
					country_list: country_list,
					city_list: city_list,
				})
			}
			if(nextProps.answer.state == 'FINISH_LOAD_USER_INFO' && nextProps.answer.data.result == 'success') {
				let user = nextProps.answer.data.user;
				this.setState({
					fio: user.second_name + ' ' + user.first_name + ' ' + user.third_name,
					email: user.email,
					phone: user.phone,
					notification_types: user.notifications_types,
					alert_types: user.notifications,
					org_name: user.company_name,
					country_id: user.country,
					city_id: user.city,
					street: user.street,
					house: user.house,
					company_inn: user.company_inn,
					company_kpp: user.company_kpp,
					company_adress: user.company_addr,
					company_rs: user.company_rs,
					company_cors: user.company_cors,
					company_bank: user.company_bank_name,
					company_bik: user.company_bank_bik,
					user_rule: user.user_rule[0]._id,
					status: user.active == true ? 1 : 2,
					section: user.house_section,
					house_section: user.apartment,
					lang_id: user.lang_id,
					langs_list: nextProps.answer.data.langs
				});
			}

			if(nextProps.answer.state == 'FINISH_LOAD_ULIST' && nextProps.answer.data.result == 'error') {
                let errors = [];
				errors.push({
                    type: 'm2error',
                    title: 'Ошибка загрузки справочников',
                    text: nextProps.answer.data.data || '{NETWORK_ERROR}'
                });
				this.setState({errors: errors});
			}

			if(nextProps.answer.state == 'ERROR_LOAD_ULIST') {
				let errors = [];
                errors.push({
                    type: 'm2error',
                    title: 'Ошибка загрузки справочников',
                    text: nextProps.answer.data.data || '{NETWORK_ERROR}'
                });
                this.setState({errors: errors});
			}

			if(nextProps.answer.state == 'ERROR_UPDATE_USER') {
				let errors = [];
                errors.push({
                    type: 'm2error',
                    title: 'Ошибка обновления пользователя',
                    text: nextProps.answer.data.data || '{NETWORK_ERROR}'
                });
                this.setState({errors: errors});
			}

			if(nextProps.answer.state == 'FINISH_UPDATE_USER') {
				let errors = [];

                if(nextProps.answer.data.result == 'error') {
                    errors.push({
                        type: 'm2error',
                        title: 'Ошибка обновления пользователя',
                        text: nextProps.answer.data.data || '{NETWORK_ERROR}'
                    });

                } else {
                    errors.push({
                        type: 'm2success',
                        title: 'Пользователь успешно обновлен',
                    });

                }

                this.setState({errors: errors});
			}
		}
	}


	render() {
		let className = ['m2dash_section_info_container'], errors = this.state.errors, loading = false;
		
		let fields = {
			'section_1' : {
				title: 'Контактная информация',
				title_ph: 'LBL_CONTACT_INFO',
				rows: [
					{
						fields: [
							{
								name: 'name',
								label: 'ФИО',
								ph: 'LBL_FIO',
								value: this.state.fio,
								placeholder: 'Введите ФИО',
								callback: this.__updateFio.bind(this),
								type: 'text',
								inputType: 'text',
								require: true
							}
						]
					},
					{
						fields: [
							{
								name: 'phone',
								label: 'Телефон',
								ph: 'LBL_PHONE',
								value: this.state.phone,
								placeholder: 'Введите номер телефона',
								callback: this.__updatePhone.bind(this),
								type: 'text',
								inputType: 'text',
								require: true
							}
						]
					},
					{
						fields: [
							{
								name: 'email',
								label: 'Email',
								ph: 'LBL_EMAIL',
								value: this.state.email,
								placeholder: 'Введите Email',
								callback: this.__updateEmail.bind(this),
								type: 'text',
								inputType: 'email',
								require: true
							}
						]
					},
					{
						className: 'm2dash_inputs_row',
						fields: [
							{
								name: 'password',
								label: 'Пароль',
								ph: 'LBL_PASSWORD',
								value: this.state.password,
								placeholder: 'Введите пароль',
								callback: this.__updatePassword.bind(this),
								type: 'text',
								inputType: 'password',

							},
							{
								name: 'password_repeat',
								value: this.state.password_repeat,
								placeholder: 'Введите пароль еще раз',
								callback: this.__updatePasswordRepeat.bind(this),
								type: 'text',
								inputType: 'password',

							}
						]
					},
					{

						className: 'm2dash_form_row_any_select',
						fields: [
							{
								name: 'notification_types',
								value: this.state.notification_types,
								callback: this.__updateNotificationTypes.bind(this),
								default_value: 'Выберете способ уведомлений',
								type: 'select',
								label: 'Уведомления',
								ph: 'USERS_EDIT_NOTIFICATIONS',
								items: Config.NOTIFICATION_TYPES
							},
							{
								name: 'alert_types',
								value: this.state.alert_types,
								callback: this.__updateAlertTypes.bind(this),
								default_value: 'Выберете тип уведомлений',
								type: 'select',
								items: Config.ALERT_TYPES
							}
						]
					}
				]
			},
			'section_2': {
				title: 'Данные об организации',
				title_ph: 'USERS_EDIT_ORG_INFO',
				rows: [
					{
						fields: [
							{
								name: 'org_name',
								label: 'Название',
								ph: 'LBL_NAME',
								value: this.state.org_name,
								placeholder: 'Введите название организации',
								callback: this.__updateOrgName.bind(this),
								type: 'text',
								inputType: 'text',
								require: true
							}
						]
					},
					{
						className: 'm2dash_form_row_any_select',
						fields: [
							{
								name: 'country',
								label: 'Страна',
								ph: 'LBL_COUNTRY',
								items: this.state.country_list,
								value: this.state.country_id,
								default_value: 'Выберите страну',

								type: 'select',
								callback: this.__updateCountry.bind(this),
								require: true
							},
							{
								name: 'city',
								label: 'Город',
								ph: 'LBL_CITY',
								items: this.state.city_list,
								default_value: 'Выберите город',

								type: 'select',
								value: this.state.city_id,
								callback: this.__updateCity.bind(this),
								require: true,
								className: 'm2city_select'
							}
						]
					},
					{
						fields: [
							{
								value: this.state.street,
								callback: this.__updateStreet.bind(this),
								name:'street',
								label: 'Улица',
								ph: 'LBL_STREET',
								type: 'text',
								inputType: 'text',
								require: true,
								placeholder: 'Введите название улицы',
							}
						]
					},

					{
						className: 'm2dash_form_address',
						fields: [
							{
								name: 'house',
								label: 'Дом',
								ph: 'LBL_BUILDING',
								value: this.state.house,
								placeholder: t("LBL_NUMBER_PH", "Номер"),
								callback: this.__updateHouse.bind(this),
								type: 'text'
							},
							{
								name: 'section',
								label: 'Корпус',
								ph: 'LBL_BUILDING_CORPUS',
								value: this.state.section,
								placeholder: t("LBL_NUMBER_PH", "Номер"),
								callback: this.__updateSection.bind(this),
								type: 'text'
							},
							{
								name: 'house_section',
								label: 'Строение',
								ph: 'LBL_BUILDING_STROENIE',
								value: this.state.house_section,
								placeholder: t("LBL_NUMBER_PH", "Номер"),
								callback: this.__updateHouseSection.bind(this),
								type: 'text'
							}
						]
					},
					{
						className:'m2two_fields',
						fields: [
							{
								name: 'inn',
								label: 'ИНН',
								ph: 'LBL_INN',
								value: this.state.company_inn,
								placeholder: t("LBL_NUMBER_PH", "Номер"),
								callback: this.__updateCInn.bind(this),
								type: 'text'
							},
							{
								name: 'kpp',
								label: 'КПП',
								ph: 'LBL_KPP',
								value: this.state.company_kpp,
								placeholder: t("LBL_NUMBER_PH", "Номер"),
								callback: this.__updateCKpp.bind(this),
								type: 'text'
							},
						]
					},
					{
						className: 'm2biglabel',
						fields: [
							{
								name: 'company_address',
								label: 'Юридический адрес',
								ph: 'LBL_LEGAL_ADDRESS',
								value: this.state.company_adress,
								placeholder: 'Введите юридический адрес',
								callback: this.__updateCAdress.bind(this),
								type: 'text'
							}
						]
					},
					{
						className:'m2two_fields',
						fields: [
							{
								name: 'company_rss',
								label: 'Р. счёт',
								ph: 'LBL_R_SCHET',
								value: this.state.company_rs,
								placeholder: t("LBL_NUMBER_PH", "Номер"),
								callback: this.__updateCRs.bind(this),
								type: 'text'
							},
							{
								name: 'company_cors',
								label: 'Корр.счёт',
								ph: 'LBL_KOR_SCHET',
								value: this.state.company_cors,
								placeholder: t("LBL_NUMBER_PH", "Номер"),
								callback: this.__updateCRS.bind(this),
								type: 'text'
							}
						]
					},
					{
						className:'m2two_fields',
						fields: [
							{
								name: 'company_bank',
								label: 'Банк',
								ph: 'LBL_BANK',
								value: this.state.company_bank,
								placeholder: 'Название банка',
								callback: this.__updateCBank.bind(this),
								type: 'text'
							},{
								name: 'company_bik',
								label: 'БИК',
								ph: 'LBL_BIK',
								value: this.state.company_bik,
								placeholder: t("LBL_NUMBER_PH", "Номер"),
								callback: this.__updateCBik.bind(this),
								type: 'text'
							}
						]
					},
                    {
                        fields: [
                            {
                                name: 'lang_id',
                                label: 'Язык',
								ph: 'LBL_LANGUAGE',
                                items:  this.state.langs_list,
                                callback: this.__updateLang.bind(this),
                                type: 'select',
                                defaultValue: 'Выберите язык',
                                value: this.state.lang_id
                            }
                        ]
                    }
				]
			}
		};


		if(this.props.answer && this.props.answer.state) {
			switch(this.props.answer.state) {
				case 'FINISH_LOAD_ULIST':
					if(this.props.answer.data.result == 'error') {
						// errors.push({
						// 	type: 'm2error',
						// 	title: 'Ошибка загрузки справочников',
						// 	text: this.props.answer.data.data || '{NETWORK_ERROR}'
						// });
						$('html, body').animate({scrollTop: 0}, 300);
					}
				break;
				
				case 'ERROR_LOAD_ULIST':
					// errors.push({
					// 	type: 'm2error',
					// 	title: 'Ошибка загрузки справочников',
					// 	text: this.props.answer.data.data || '{NETWORK_ERROR}'
					// });
					$('html, body').animate({scrollTop: 0}, 300);
				break;

				case 'START_UPDATE_USER': loading = true; break;
				
				case 'ERROR_UPDATE_USER':
					// errors.push({
					// 	type: 'm2error',
					// 	title: 'Ошибка обновления пользователя',
					// 	text: this.props.answer.data.data || '{NETWORK_ERROR}'
					// });
					$('html, body').animate({scrollTop: 0}, 300);
				break;

				case 'FINISH_UPDATE_USER':

					// if(this.props.answer.data.result == 'error') {
					// 	errors.push({
					// 		type: 'm2error',
					// 		title: 'Ошибка обновления пользователя',
					// 		text: this.props.answer.data.data || '{NETWORK_ERROR}'
					// 	});
					//
					// } else {
					// 	errors.push({
					// 		type: 'm2success',
					// 		title: 'Пользователь успешно обновлен',
					// 	});
					//
					// }
					$('html, body').animate({scrollTop: 0}, 300);
				break;

				case 'START_LOAD_USER_INFO': loading = true; break;

				case 'FINISH_LOAD_USER_INFO':
					loading = false;
					if(this.props.answer.data.result == 'error') {
						errors.push({
							type: 'm2error',
							title: 'Ошибка загрузки информации о пользователе',
							text: this.props.answer.data.data || '{NETWORK_ERROR}'
						});
					}
				break;

				case 'ERROR_LOAD_USER_INFO':
					loading = false;
					errors.push({
						type: 'm2error',
						title: 'Ошибка загрузки информации о пользователе',
						text: this.props.answer.data.data || '{NETWORK_ERROR}'
					});
				break;
			}
		}
		if(loading) {
			className.push('m2loading');
		}

		return (
			<div className="m2dashboard">
				<Header />
				<section className="m2dash_section m2dash_section_info m2profile">
					<section className="m2dash_section m2dash_navs">
						<NavControlls items={Config.CabinetNavs[this.state.group]}/>
					</section>
					<div className={className.join(' ')}>
						<Notifications items={errors} />
						<div className="m2dash_item_form">
							<div className="m2dash_form_title">
								<span className="title_main"><T ph="USERS_EDIT_INFO_1" def="Редактирование пользователя"/></span>
								<span className="title_sub"><T ph="USERS_EDIT_INFO_2" def="заполните всю информаицю о пользователе"/></span>
							</div>
							<form method="POST" onSubmit={this.__formSubmit.bind(this)}>
								<FormGenerator sections={fields}/>
								<div className="m2form_buttons">
									<button type="submit" className="m2btn-primary"><T ph="LBL_SAVE" def="Сохранить"/></button>
								</div>
							</form>
						</div>
					</div>
				</section>
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
)(Edit);
