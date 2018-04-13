import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Items from '../../components/Cabinet/Items';
import Notifications from '../../components/Notifications';
import * as CampaingActions from '../../actions/campaigns';
import * as M2Format from '../../library/M2Format';
import T, {t} from '../../components/Translate/Translate';

class MainClient extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status: 1,
			current_page: 1,
			items: []
		}
		
	}

	__getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}

	componentWillReceiveProps(nextProp) {
		if(nextProp.answer) {
			switch(nextProp.answer.state) {
				case 'FINISH_LOAD_CAMPAIGNS': 
					if(nextProp.answer.data.result != 'error') {
						this.setState({items: nextProp.answer.data.campaigns});
					}
				break;
				case 'FINISH_LOAD_CAMPAIGNS_FILTER': 
					let items = this.state.items;
					nextProp.answer.data.campaigns.map(item => items.push(item));
					this.setState({items: items});
				break;
			}
		}
		
	}

	__incPage() {
		
	}


	componentDidMount() {
		this.props.actions.loadCampaigns(1, this.state.current_page);
		this.props.actions.loadAllStats()
	}

	render(){


		let loading = false, errors = [], options = {}, items = this.state.items;
		let balance = {}, dynamic = [];

		if(this.props.answer) {
			switch(this.props.answer.state) {
				case 'START_LOAD_CAMPAIGNS':
					loading = true;
				break;

				case "ERROR_LOAD_ALL_STATS":
					errors.push({
						type: 'm2error',
						title: 'Ошибка загрузки статистики',
						text: this.props.answer.data.data || '{NETWORK_ERROR}'
					})
				break;

				case "FINISH_LOAD_ALL_STATS":
					if(this.props.answer.data.result == 'error') {
						errors.push({
							type: 'm2error',
							title: 'Ошибка загрузки статистики',
							text: this.props.answer.data.data || '{NETWORK_ERROR}'
						});
					} else {
						balance = this.props.answer.data.balance;
						this.props.answer.data.dynamic.map(function(item) {
							dynamic.push({
								"дата": item.date,
								"показы": item.shows,
								"переходы": item.clicks
							})
						});
					}
				break;




				case 'FINISH_LOAD_CAMPAIGNS':
					loading = false;
					if(this.props.answer.data.result == 'error') {
						errors.push({
							type: 'm2error',
							title: 'Ошибка загрузки кампаний',
							text: (this.props.answer.data.data) ? this.props.answer.data.data : "{NETWORK_ERROR}"
						});
					} else {
						//items = this.props.answer.data.campaigns;
						options = this.props.answer.data.info;
					}
				break;
				
				case 'ERROR_LOAD_CAMPAIGNS':
					loading = false;
					errors.push({
						type: 'm2error',
						title: 'Ошибка загрузки кампаний',
						text: (this.props.answer.data.data) ? this.props.answer.data.data : "{NETWORK_ERROR}"
					});
				break;


				case 'START_LOAD_CAMPAIGNS_FILTER': loading = true; break;

				case 'ERROR_LOAD_CAMPAIGNS_FILTER':
					loading = false;
					errors.push({
						type: 'm2error',
						title: 'Ошибка загрузки кампаний',
						text: (this.props.answer.data.data) ? this.props.answer.data.data : "{NETWORK_ERROR}"
					});
				break;

				case 'FINISH_LOAD_CAMPAIGNS_FILTER':
					loading = false;
					if(this.props.answer.data.result == 'error') {
						errors.push({
							type: 'm2error',
							title: 'Ошибка загрузки кампаний',
							text: (this.props.answer.data.data) ? this.props.answer.data.data : "{NETWORK_ERROR}"
						});
					} else {
						//items = this.props.answer.data.campaigns;
						options = this.props.answer.data.info;
					}
				break;
			}
		}

		let className = ['m2dash_section', 'm2dash_items'];

		return (
			<div className="m2cabinet">
				<div className="m2cabinet_row">
					<div className="m2cabinet_column m2cabinet_column_small">
						<div className="m2dashboard_platform_full">
							<div className="title">
								<span className="big"><T ph="CLIENTS_TOTAL_SPENT_1" def="Сегодня вы потратили"/></span>
								<span className="small"><T ph="CLIENTS_TOTAL_SPENT_2" def="обновляется автоматически раз в сутки"/></span>
							</div>
							<div className="stats">
								<div className="stats_column">
									<div className="value">{balance.current > 0 ? M2Format.numberFormat(balance.current,0,'',' ') : 0} ₽</div>
									{balance.def && <div className={balance && balance.up ? "title title_up" : "title title_down"}><T ph="PLATFORMS_STATS_YESTERDAY_1" def="На"/> {balance && balance.def ? M2Format.numberFormat(Math.abs(balance.def),0,'',' '): 0} ₽ {balance && balance.up ? <T ph="LBL_GREATER" def="больше"/> : <T ph="LBL_LESS" def="меньше"/>} <T ph="PLATFORMS_STATS_YESTERDAY_2" def="чем вчера"/></div>}
								</div>
							</div>
						</div>
					</div>
					<div className="m2cabinet_column m2cabinet_column_big">
						<div className="m2dashboard_platform_full">
							<div className="title">
								<span className="big"><T ph="CLIENTS_DYNAMIC_1" def="Динамика активных кампаний за сутки"/></span>
								<span className="small"><T ph="CLIENTS_DYNAMIC_2" def="учитываются только активные кампании"/></span>
							</div>
							<div className="stats_grap">
								<ResponsiveContainer width="100%" height={110}>
									<LineChart data={dynamic} dot={false} bgColor='#FBFBFD'>
										<Tooltip />
										<Legend verticalAlign="top" iconType="circle"/>
										<XAxis dataKey="дата"  axisLine={true}/>
										<Line type="monotone" legendType="circle" dataKey="переходы" stroke="#6DBD37" />
										<Line type="monotone" legendType="circle" dataKey="показы" stroke="#FF7B00" />
									</LineChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</div>
				<section className={className.join(' ')}>
					<Notifications items={errors}/>
					<Items items={items} options={options} type="user_campaigns" incPage={this.__incPage.bind(this)}/>
				</section>
			</div>
		);
	}
}


const mapStateToProps = state => ({
	answer: state.CampaignReducer
});

const mapDispatchProps = dispatch => ({
	actions: bindActionCreators(CampaingActions, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchProps
)(MainClient);
