import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import T, {t} from '../../components/Translate/Translate';
import M2Store from '../../library/M2Store';
import Header from '../../components/Cabinet/Header';


import * as Config from '../../config';
import NavControlls from '../../components/Admin/NavControlls';
import Filter from '../../components/Cabinet/Filter';
import Items from '../../components/Cabinet/Items';
import Notifications from '../../components/Notifications';
import * as CoorpActions from '../../actions/coorps';

const Storage = new M2Store();

class Users extends React.Component {
	constructor(props) {
		super(props);
		let group = 'client';

		if(Storage.get('info')) {
			let balance = JSON.parse(Storage.get('info'));
			
			group = balance.group.alias;
		}
        document.title = t('TITLE_EMPLOYEES_PAGE', 'Сотрудники');
		this.state = {
			group: group
		}
	}

	componentDidMount() {
		this.props.actions.loadList();
	}

	addUser(data) {
        this.props.actions.addUser(data);
	}

	updateUser(id, data) {
		this.props.actions.updateUser(id, data);
	}

	remove(id) {
		this.props.actions.removeUser(id);
	}

	render() {
		let loading = false;
		let items = [], errors = [], options={};
		let className = ['m2dash_section', 'm2dash_items'];

		if(this.props.answer) {
			switch (this.props.answer.state) {
				case 'START_LOAD_COOPRS': loading = true; break;
				case 'START_ADD_COOPRS': loading = true; break;
				case 'START_UPDATE_COOPRS': loading = true; break;
				case 'START_REMOVE_COOPRS': loading = true; break;
                case 'ERROR_REMOVE_COOPRS':
                    loading = false;
                    errors.push({
                        type: 'm2error',
                        title: 'Ошибка удаления сотрудника',
                        text: this.props.answer.data.data || '{NETWORK_ERROR}'
                    });
                    break;
                case 'ERROR_UPDATE_COOPRS':
                    loading = false;
                    errors.push({
                        type: 'm2error',
                        title: 'Ошибка обновления сотрудника',
                        text: this.props.answer.data.data || '{NETWORK_ERROR}'
                    });
                    break;
				case 'ERROR_LOAD_COOPRS':
					loading = false;
					errors.push({
						type: 'm2error',
						title: 'Ошибка загрузки сотрудников',
						text: this.props.answer.data.data || '{NETWORK_ERROR}'
					});
					break;
				case 'FINISH_LOAD_COOPRS':
					loading = false;
					if(this.props.answer.data.result == 'error') {
						errors.push({
							type: 'm2error',
							title: 'Ошибка загрузки сотрудников',
							text: this.props.answer.data.data || '{NETWORK_ERROR}'
						})
					} else {
						items = this.props.answer.data.users;
					}
					break;
                case 'FINISH_UPDATE_COOPRS':
                    loading = false;
                    if(this.props.answer.data.result == 'error') {
                        errors.push({
                            type: 'm2error',
                            title: 'Ошибка обновления сотрудников',
                            text: this.props.answer.data.data || '{NETWORK_ERROR}'
                        })
                    } else {
                        this.props.actions.loadList();
                    }
                    break;
                case 'ERROR_ADD_COOPRS':
                    loading = false;
                    errors.push({
                        type: 'm2error',
                        title: 'Ошибка добавления сотрудника',
                        text: this.props.answer.data.data || '{NETWORK_ERROR}'
                    });
                   break;
                case 'FINISH_ADD_COOPRS':
                    loading = false;
                    if(this.props.answer.data.result == 'error') {
                        errors.push({
                            type: 'm2error',
                            title: 'Ошибка добавления сотрудника',
                            text: this.props.answer.data.data || '{NETWORK_ERROR}'
                        })
                    } else {
                        this.props.actions.loadList();
					}
                    break;

                case 'FINISH_REMOVE_COOPRS':
                    loading = false;
                    if(this.props.answer.data.result == 'error') {
                        errors.push({
                            type: 'm2error',
                            title: 'Ошибка удаления сотрудника',
                            text: this.props.answer.data.data || '{NETWORK_ERROR}'
                        })
                    } else {
                        this.props.actions.loadList();
                    }
                    break;
			}
		}

		if(loading) {
			className.push('m2loading');
		}

		return (
			<div className="m2dashboard">
				<Header />
				<main className="m2dashboard_container">
					<section className="m2dash_section m2dash_navs">
						<NavControlls items={Config.CabinetNavs[this.state.group]}/>
					</section>
					<section className={className.join(' ')}>
						<Notifications items={errors}/>
						<Items remove={this.remove.bind(this)} update={this.updateUser.bind(this)} add={this.addUser.bind(this)} items={items} type="coorps"/>
					</section>
				</main>
			</div>
		)
	}
}

const mapStateToProps = state => ({
    answer: state.CoorpReducer
});

const mapDispatchProps = dispatch => ({
    actions: bindActionCreators(CoorpActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchProps
)(Users);
