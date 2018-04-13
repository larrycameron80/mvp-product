import React from 'react';
import { Link } from 'react-router';
import * as M2Generator from '../../../library/M2Generators';
import T, {t} from '../../../components/Translate/Translate';

require('../../../library/dates');

class UserStats extends React.Component{
	constructor(props) {
		super(props);
	}

	__formatDate(date) {
		var a = new Date(date);
		return a.format('dd-mm-yyyy HH:MM:ss')
	}

	

	__generateTemplate(item) {

		return (
			<div className="m2dash_item" key={item.date + '_' + M2Generator.guid()}>
				<div className="m2dash_item_title">
					<span className="title">{item.date}</span>
					<span className="date">дата статистики</span>
				</div>
				<div className="m2dash_item_content">
					<div className="m2dash_item_content_row">
						<span className="item_title">ID площадки:</span>
						<span className="item_value"><Link className="m2dash_item_link" href={'/cp/platforms/' + item.platform_id}>{item.platform_uid}</Link></span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_NAME" def="Название"/>:</span>
						<span className="item_value">{item.platform_name}</span>
					</div>
					<div className="m2dash_item_content_row_separator"></div>
					<div className="m2dash_item_content_row">
						<span className="item_title">ID кампании:</span>
						<span className="item_value"><Link className="m2dash_item_link" href={'/cp/campaigns/' + item.banner_id}>{item.banner_uid}</Link></span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_NAME" def="Название"/>:</span>
						<span className="item_value">{item.banner_name}</span>
					</div>
					<div className="m2dash_item_content_row_separator"></div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_SHOWS" def="Показы"/>:</span>
						<span className="item_value">{item.shows}</span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_TRANSITIONS" def="Переходы"/>:</span>
						<span className="item_value">{item.clicks}</span>
					</div>
					<div className="m2dash_item_content_row_separator"></div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_PROFIT" def="Заработано  (₽)"/>:</span>
						<span className="item_value">{item.total}</span>
					</div>
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


export default UserStats;