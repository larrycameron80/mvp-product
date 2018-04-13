import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Items from '../../components/Cabinet/Items';
import Notifications from '../../components/Notifications';
import * as PlatformActions from '../../actions/platforms';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import * as M2Format from '../../library/M2Format';
import T, {t} from '../../components/Translate/Translate';

class MainOwner extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			status: 1,
			items: [],
			city: {},
			country: {},
			rubrics: {},
			themes: {}
		}
	}


	__incPage() {
		let page = this.state.page + 1;
		this.setState({page: page});
		this.props.actions.loadList(page, this.state.filter);
	}

	componentDidMount() {
		this.props.actions.loadOwnerMain();
		this.props.actions.LoadAllStats(this.state.page);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.answer && nextProps.answer.state == 'FINISH_LOAD_OWNER_PAGE') {
			let items = nextProps.answer.data.items;

			this.setState({
				items: items
			})
		}
	}

    addBookmark(id){
		if(id) {
			this.props.actions.addBookmark(id);
		}
	}

    removeBookmark(id) {
    	if(id) {
    		this.props.actions.removeBookmark(id);
		}
	}


	__getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}


	render(){
		let loading = false;
		let items = this.state.items, errors = [], options={};
		let className = ['m2dash_section', 'm2dash_items'];
		let ag = {}, ag_stats = [];

		if(this.props.answer) {
			switch(this.props.answer.state) {

				case 'FINISH_LOAD_ALL_STATS':
					if(this.props.answer.data.result == 'error') {
						errors.push({
							type: 'm2error',
							title: 'Ошибка загрузки статистики',
							text: this.props.answer.data.data || '{NETWORK_ERROR}'
						})
					} else {
						ag = this.props.answer.data.ag;
						this.props.answer.data.ag_stats.map(item => ag_stats.push({'дата': item.date, 'прибыль': item.value}))
					}
				break;

				case 'ERROR_LOAD_ALL_STATS':
					errors.push({
						type: 'm2error',
						title: 'Ошибка загрузки статистики',
						text: this.props.answer.data.data || '{NETWORK_ERROR}'
					})
				break;

				case 'START_LOAD_OWNER_PAGE':
					loading = true;
					
				break;

                case 'START_ADD_BOOKMARK':
                    loading = true;
				break;

                case 'START_REMOVE_BOOKMARK':
                    loading = true;
                break;

                case 'FINISH_ADD_BOOKMARK':
                    loading = false;
                    if(this.props.answer.data.result == 'error') {
                        errors.push({
                            type: 'm2error',
                            title: 'Ошибка',
                            text: this.props.answer.data.data || '{NETWORK_ERROR}'
                        })
                    } else {
                        this.props.actions.loadOwnerMain();
					}
                break;

                case 'FINISH_REMOVE_BOOKMARK':
                    loading = false;
                    if(this.props.answer.data.result == 'error') {
                        errors.push({
                            type: 'm2error',
                            title: 'Ошибка',
                            text: this.props.answer.data.data || '{NETWORK_ERROR}'
                        })
                    } else {
                        this.props.actions.loadOwnerMain();
                    }
                break;

                case 'ERROR_ADD_BOOKMARK':
                    loading = false;
                   	errors.push({
                            type: 'm2error',
                            title: 'Ошибка',
                            text: this.props.answer.data.data || '{NETWORK_ERROR}'
                    });
                 break;

                case 'ERROR_REMOVE_BOOKMARK':
                    loading = false;
                    errors.push({
                        type: 'm2error',
                        title: 'Ошибка',
                        text: this.props.answer.data.data || '{NETWORK_ERROR}'
                    });
                break;

				case 'FINISH_LOAD_OWNER_PAGE':
					loading = false;
					if(this.props.answer.data.result == 'error') {
						errors.push({
							type: 'm2error',
							title: 'Ошибка',
							text: this.props.answer.data.data || '{NETWORK_ERROR}'
						})
					}
				break;

				case 'ERROR_LOAD_OWNER_PAGE':
					loading = false;
					errors.push({
						type: 'm2error',
						title: 'Ошибка',
						text: this.props.answer.data.data
					})
				break;
			}
		}

		return (
			<div className="m2cabinet">
				<div className="m2dashboard_platform_full">
						<div className="title">
							<span className="big"><T ph="PLATFORMS_PROFIT_1" def="Ваш доход" /></span>
							<span className="small"><T ph="PLATFORMS_PROFIT_2" def="обновляется автоматически раз в сутки" /></span>
						</div>
						<div className="stats">
							<div className="stats_column">
								<div className="value">{ag['days'] ? M2Format.numberFormat(ag['days'].value,0,'',' ') : 0} ₽</div>
								<div className={ag['days'] && ag['days'].up ? "title title_up" : "title title_down"}><T ph="PLATFORMS_STATS_YESTERDAY_1" def="На"/> {ag['days'] && ag['days'].def ? M2Format.numberFormat(Math.abs(ag['days'].def),0,'',' '): 0} ₽ {ag['days'] && ag['days'].up ? <T ph="LBL_GREATER" def="больше"/> : <T ph="LBL_LESS" def="меньше"/>} <T ph="PLATFORMS_STATS_YESTERDAY_2" def="чем вчера"/></div>
							</div>
							<div className="stats_column">
								<div className="value">{ag['week'] ? M2Format.numberFormat(ag['week'].value,0,'',' ') : 0} ₽</div>
								<div className={ag['week'] && ag['week'].up ? "title title_up" : "title title_down"}><T ph="PLATFORMS_STATS_LAST_WEEK_1" def="На"/> {ag['week'] && ag['week'].def ? M2Format.numberFormat(Math.abs(ag['week'].def),0,'',' '): 0} ₽ {ag['week'] && ag['week'].up ? <T ph="LBL_GREATER" def="больше"/> : <T ph="LBL_LESS" def="меньше"/>} <T ph="PLATFORMS_STATS_LAST_WEEK_2" def="чем прошлая неделя"/></div>
							</div>
							<div className="stats_column">
								<div className="value">{ag['month'] ? M2Format.numberFormat(ag['month'].value,0,'',' ') : 0} ₽</div>
								<div className={ag['month'] && ag['month'].up ? "title title_up" : "title title_down"}><T ph="PLATFORMS_STATS_LAST_MONTH_1" def="На"/> {ag['month'] && ag['month'].def ? M2Format.numberFormat(Math.abs(ag['month'].def),0,'',' '): 0} ₽ {ag['month'] && ag['month'].up ? <T ph="LBL_GREATER" def="больше"/> : <T ph="LBL_LESS" def="меньше"/>} <T ph="PLATFORMS_STATS_LAST_MONTH_2" def="чем прошлый месяц"/></div>
							</div>
						</div>
					</div>
					<section className="m2dash_section m2dash_section_info m2dash_owner_cabinet">
						<div className="m2dashboard_stats">
							<div className="m2dashboard_stats_title">
								<span className="title"><T ph="PLATFORMS_DYNAMICS_1" def="Динамика дохода по всем площадкам" /></span>
								<span className="sub_title"><T ph="PLATFORMS_DYNAMICS_1" def="отображается динамика за неделю" /></span>
							</div>
						</div>
						<div className="m2dash_section_info_container">
						<div className="m2dashboard_stats_chart">
							<ResponsiveContainer width="100%" height={150}>
								<LineChart data={ag_stats} dot={false} bgColor='#FBFBFD'>
									<Tooltip />
									<XAxis dataKey="дата"  axisLine={true}/>
									<Line type="monotone" legendType="circle" dataKey={t("LINECHART_PROFIT", "прибыль")} stroke="#1772E0" />
								</LineChart>
							</ResponsiveContainer>
						</div>
						</div>
					</section>
				<section className={className.join(' ')}>
					<Notifications items={errors}/>
					<Items removeBookmark={this.removeBookmark.bind(this)} addBookmark={this.addBookmark.bind(this)} items={items} type="owner_main_page"/>
				</section>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	answer: state.PlatformReducer
});

const mapDispatchProps = dispatch => ({
	actions: bindActionCreators(PlatformActions, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchProps
)(MainOwner);
