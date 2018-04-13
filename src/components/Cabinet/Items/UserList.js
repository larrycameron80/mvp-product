import React from 'react';
import { Link } from 'react-router';
import T, {t} from '../../../components/Translate/Translate';

import * as M2Format from '../../../library/M2Format';
require('../../../library/dates');

class UserList extends React.Component {
	constructor(props) {
		super(props);
	}

	__fDate(date) {
		return (date) ? (new Date(date)).format('dd.mm.yyyy') : '';
	}

	__removeUser(event) {
		event.preventDefault();
		let id = event.target.attributes['data-user'].value;
		if(id) {
			this.props.removeItem(id);
		}
	}

	__templateIterator(item) {
		return (
			<div className="m2dash_item" key={item.id}>
				<div className="m2dash_item_title">
					<span className="title">{item.name}</span>
					<span className="date">Зарегистрирован {this.__fDate(item.created_at)}</span>
				</div>
				<div className="m2dash_item_content">
					<div className="m2dash_item_content_row">
						<span className="item_title">ID:</span>
						<span className="item_value">{item.id}</span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title">Компания:</span>
						<span className="item_value">{item.company_name}</span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_PHONE" def="Телефон" />:</span>
						<span className="item_value"><Link href={"tel:" + item.phone}>{item.phone}</Link></span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title">Email:</span>
						<span className="item_value"><Link href={"mailto:" + item.email}>{item.email}</Link></span>
					</div>
					<div className="m2dash_item_content_row_separator"></div>
					<div className="m2dash_item_content_row">
						<span className="item_title">Группа:</span>
						<span className="item_value">{item.group}</span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_STATUS" def="Статус"/>:</span>
						<span className="item_value">{item.active ? <T ph="USERS_LIST_ACTIVE" def="Активен"/> : <T ph="USERS_LIST_INACTIVE" def="Не активен"/>}</span>
					</div>
					<div className="m2dash_item_controlls_buttons m2dash_full_items">
						<Link to={"/cp/users/" + item.id} className="m2edit_btn"><T ph="LBL_EDIT" def="Редактировать"/></Link>
						<Link onClick={this.__removeUser.bind(this)} data-user={item.id} to="#" className="m2delete_btn"><T ph="LBL_DELETE" def="Удалить"/></Link>
					</div>
				</div>
			</div>
		)
	}

	render() {
		return (
			<div className="m2dashboard_action_items">
				{this.props.items.map(item => this.__templateIterator(item))}
			</div>
		);
	}
}

export default UserList;