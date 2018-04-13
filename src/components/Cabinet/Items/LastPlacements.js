import React from 'react';
import { Link } from 'react-router';
import T, {t} from '../../../components/Translate/Translate';

require('../../../library/dates');

class LastPlacements extends React.Component{
	constructor(props) {
		super(props);
	}

	__formatDate(date) {
		var a = new Date(date);
		return a.format('dd-mm-yyyy HH:MM:ss')
	}

	__generateTemplate(item) {
		return (
			<div className="m2dash_item" key={item.id}>
				<div className="m2dash_item_title">
					<span className="title">{item.name}</span>
					<span className="date">{this.__formatDate(item.created_at)}</span>
				</div>
				<div className="m2dash_item_content">
					<div className="m2dash_item_content_row">
						<span className="item_title">ID:</span>
						<span className="item_value">{item.uid}</span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title">Email:</span>
						<span className="item_value">{item.user_email}</span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_STATUS" def="Статус"/>:</span>
						<span className="item_value">{item.active ? <T ph="CAMPAIGNS_LIST_ACTIVE" def="Активна"/> : <T ph="CAMPAIGNS_LIST_INACTIVE" def="Не активна"/>}</span>
					</div>
				</div>
				<div className="m2dash_item_controlls">
					<Link to={"/cp/users/" + item.user_id} className="m2btn_item">Редактировать пользователя</Link>
					<Link to={"/cp/platforms/" + item.id} className="m2btn_item">Редактировать площадку</Link>
				</div>
			</div>
		);
	}

	render() {
		let items = [];
		if(this.props.items && this.props.items.length > 0){
			this.props.items.map(item => items.push(this.__generateTemplate(item)));
		}
		return (
			<div className="m2dashboard_action_items">
				{items}
			</div>
		);
	}

}


export default LastPlacements;