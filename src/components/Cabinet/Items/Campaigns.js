import React from 'react';
import { Link } from 'react-router';

import T, {t} from '../../../components/Translate/Translate';
import { CAMPAIGN_TYPES, CAMPAIGN_STATUSES } from '../../../config';
import * as M2Format from '../../../library/M2Format';
require('../../../library/dates');



class Campaigns extends React.Component {
	__formatDate(date) {
		var a = new Date(date);
		return a.format('dd-mm-yyyy HH:MM:ss')
	}

	__formatPeriod(date_start, date_end) {
		var a = new Date(date_start);
		var b = new Date(date_end);
		return a.format('dd.mm.yyyy') + ' - ' + b.format('dd.mm.yyyy');
	}

	__getActiveDays(end_date){
		
		var count_days = ((new Date(end_date)).getTime() - (new Date()).getTime());
		
		count_days = Math.ceil(count_days / (24 * 60 * 60 * 1000));
		return (count_days < 0) ? '0 дней' : 'Активна еще ' + count_days + ' ' + M2Format.dateInterval(count_days,['день', 'дня', 'дней']);
	}

	__generateTemplate(item) {
		let cost = item.budget - item.banner_cost;
		return (
			<div className="m2dash_item" key={item.id}>
				<div className="m2dash_item_title">
					<span className="title">{item.name}</span>
					<span className="date">{this.__getActiveDays(item.end_from)}</span>
				</div>
				<div className="m2dash_item_content">
					<div className="m2dash_item_content_row">
						<span className="item_title">ID:</span>
						<span className="item_value">{item.uid}</span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_FORMAT" def="Формат"/>:</span>
						<span className="item_value">{CAMPAIGN_TYPES[item.banner_type] ? <T ph={CAMPAIGN_TYPES[item.banner_type]['ph']} def={CAMPAIGN_TYPES[item.banner_type]['def']}/> : <T ph="CAMPAIGN_TYPE_UNKNOWN" def="{неизвестно}"/>}</span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_PERIOD" def="Период"/>:</span>
						<span className="item_value">{this.__formatPeriod(item.start_from, item.end_from)}</span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_STATUS" def="Статус"/>:</span>
						<span className="item_value">{CAMPAIGN_STATUSES[parseInt(item.show_status)] ? <T ph={CAMPAIGN_STATUSES[parseInt(item.show_status)]['ph']} def={CAMPAIGN_STATUSES[parseInt(item.show_status)]['def']}/> : <T ph="CAMPAIGN_STATUS_UNKNOWN" def="{неизвестно}"/>}</span>
					</div>
					<div className="m2dash_item_content_row_separator"></div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_SHOWS" def="Показы"/>:</span>
						<span className="item_value">{item.total_shows ? M2Format.numberFormat(item.total_shows,0,'',' ') : 0}</span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_TRANSITIONS" def="Переходы"/>:</span>
						<span className="item_value">{item.total_click ? M2Format.numberFormat(item.total_click,0,'',' ')  : 0}</span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title">CTR (%):</span>
						<span className="item_value">{item.ctr ? M2Format.numberFormat(item.ctr,2,',',' ') : 0}</span>
					</div>
					<div className="m2dash_item_content_row_separator"></div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="CAMPAIGNS_LIST_BUDGET" def="Бюджет (₽)"/>:</span>
						<span className="item_value">{item.budget ? M2Format.numberFormat(item.budget,0,'',' ') : 0}</span>
					</div>
					<div className="m2dash_item_content_row">
						<span className="item_title"><T ph="CAMPAIGNS_LIST_BALANCE" def="Остаток (₽)"/>:</span>
						<span className="item_value">{cost && cost > 0 ? M2Format.numberFormat(cost,0,'',' ') : 0}</span>
					</div>
                    {item.owner && <div className="m2dash_item_content_row">
						<span className="item_title"><T ph="LBL_OWNER" def="Владелец"/>:</span>
						<span className="item_value">{item.owner}</span>
					</div>}
					<div className="m2dash_item_content_row_separator"></div>
					<div className="m2dash_item_content_block">
						<div className="m2dash_item_content_row">
							<span className="item_title"><T ph="LBL_LINK" def="Ссылка"/>:</span>
							<span className="item_value">
								<Link className="m2dash_item_link" target="_blank" href={this.getItemLink(item.link)}><T ph="LBL_OPEN" def="Открыть"/></Link>
							</span>
						</div>
					</div>
				</div>
				<div className="m2dash_item_controlls_buttons">
					<Link to={"/cp/campaigns/" + item.id + "/stats"} className="m2btn-stats"><T ph="LBL_STATISTIC" def="Статистика"/></Link>
					<Link to={"/cp/campaigns/" + item.id} className="m2btn-edit"></Link>
				</div>
			</div>
		);
	}

	getItemLink(link) {
		return (link.indexOf('http://') + 1 == 0 && link.indexOf('https://') + 1 == 0) ? 'http://' + link : link;
	}

	render() {
		let items = [];
		if(this.props.items && this.props.items.length > 0){
			this.props.items.map(item => items.push(this.__generateTemplate(item)));
		}
		return (
			<div className="m2dashboard_action_items">
				{items}
				<div className="m2dash_item m2dash_item_create m2dash_campaign_add">
					<Link to="/cp/campaigns/add"><T ph="LBL_CREATE" def="Создать"/></Link>
				</div>
			</div>
		)
	}
}


export default Campaigns;