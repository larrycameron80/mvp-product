import React from 'react';
import { Link } from 'react-router';
import T, {t} from '../../../components/Translate/Translate';

import * as M2Format from '../../../library/M2Format';
import * as Config from '../../../config';
import M2Store from '../../../library/M2Store';
require('../../../library/dates');
const Store = new M2Store();

class UserBills extends React.Component {
	constructor(props) {
		super(props);
		let user = '';
		let group = 'owner';
		if(Store.get('info')) {
			let info = JSON.parse(Store.get('info'));
			user = info.user_id;
			group = info.group.alias;
		}



		this.state = {
			show_popup: false,
			user_id : user,
			sum: '',
			description: group == 'owner' ? 'Вывод' : 'Пополнение',
			items: props.items ? props.items : []
		}
	}

	componentWillReceiveProps(props) {
		if(props.items) {
			this.setState({items: props.items});
		}
	}


	__updateUserId(event) {
		this.setState({user_id: event.target.value});
	}

	__updateSum(event) {
		this.setState({sum: event.target.value});
	}

	__updateDescription(event) {
		this.setState({description: event.target.value});
	}

	__formSubmit(event) {
		event.preventDefault();
		let data = {
			user_to: this.state.user_id,
			sum: this.state.sum,
			description: this.state.description
		}
		this.props.addItem(data);
	}

	showPopup() {
		this.setState({show_popup: true});
	}

	closePopup() {
		this.setState({show_popup: false});
	}


	__fDate(date) {
		return (date) ? (new Date(date)).format('dd.mm.yyyy') : '';
	}

	__templateIterator(item) {
		return (
			<div className="m2dash_item" key={'user_bill_item' + item._id}>
				<div className="m2dash_item_title">
					<span className="title">Счет {item.number}</span>
					<span className="date">Создан {this.__fDate(item.created_at)}</span>
				</div>
				<div className="m2dash_item_content">
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_SUM" def="Сумма"/>:</span>
						<span className="item_value">{item.sum ? M2Format.numberFormat(item.sum,0,'',' ') : 0} ₽</span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_STATUS" def="Статус"/>:</span>
						<span className="item_value">{item.status ? <T ph="BILL_PAYED" def="Оплачен"/> : <T ph="BILL_NOT_PAYED" def="Не оплачен"/>}</span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="PAYMENTS_BILL_TYPE" def="Тип счета"/>:</span>
						<span className="item_value">{item.description}</span>
					</div>
					<div className="m2dash_item_content_row_separator"></div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="PAYMENTS_BILL_CREATOR" def="Кто выставил"/>:</span>
						<span className="item_value">{(item.user_create) ? item.user_create.email : <T ph="LBL_UNKNOWN" def="неизвестно"/>}</span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="PAYMENTS_BILL_RECIPIENT" def="Кому выставил"/>:</span>
						<span className="item_value">{(item.user_to) ? item.user_to.email : <T ph="LBL_UNKNOWN" def="неизвестно"/>}</span>
					</div>
				</div>
				<div className="m2dash_item_controlls_buttons m2dash_full_items">
					<Link target="_blank" to={Config.API_URL + "generator/" + item._id} className="m2edit_btn"><T ph="PAYMENTS_BILL_DOWNLOAD" def="Скачать PDF"/></Link>
				</div>
			</div>
		);
	}

	render() {
		let users_options = [];
		for(var i in this.props.users) {
			users_options.push(<option key={"user_create_bill_" + i} value={i}>{this.props.users[i]}</option>);
		}

		let bill_items = [], items = this.state.items;

		items.map(item => bill_items.push(this.__templateIterator(item)));


		return (
			<div className="m2dashboard_action_items">
				{bill_items}
				<div className="m2dash_item m2dash_item_create">
				
					<Link onClick={this.showPopup.bind(this)} href="#">{this.props.user_group != 'owner' ? <T ph="BILLS_INFO_9" def="Пополнить баланс" /> : <T ph="BILLS_INFO_8" def="Вывод средств" />}</Link>
					
				</div>
				{this.state.show_popup && 
				<div className="add_popup">
					<div className="add_popup_container">
						<form method="POST" onSubmit={this.__formSubmit.bind(this)}>
							<div className="form_title_row">
								<div className="form_title"><T ph="BILLS_INFO_1" def="Создание счёта" /></div>
								<div className="form_subtitle"><T ph="BILLS_INFO_2" def="быстрый процесс" /></div>
							</div>
							<div className="form_row">
								<div className="label"><T ph="BILLS_INFO_5" def="Введите сумму" /></div>
								<div className="value">
									<input type="text" name="number"  onChange={this.__updateSum.bind(this)}/>
								</div>
							</div>
							<div className="button_row">
								<button type="submit">{this.props.user_group != 'owner' ? <T ph="BILLS_INFO_9" def="Пополнить баланс" /> : <T ph="BILLS_INFO_8" def="Вывод средств" />}</button>
							</div>
						</form>
					</div>
					<Link onClick={this.closePopup.bind(this)} href="#" className="close_popup"><img src="/images/close_icon.svg" /></Link>
				</div>}
			</div>
		)
	}
}

export default UserBills;