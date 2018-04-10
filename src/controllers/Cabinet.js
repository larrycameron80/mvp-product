import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import T, {t} from '../components/Translate/Translate';
import M2Store from '../library/M2Store';
import * as Config from '../config';
import Header from '../components/Cabinet/Header';
import NavControlls from '../components/Admin/NavControlls';
import MainClient from '../components/Cabinet/MainClient';
import MainOwner from '../components/Cabinet/MainOwner';

const Storage = new M2Store();

class Cabinet extends React.Component {
	constructor(props) {
		super(props);
		let group = 'client';

		if(Storage.get('info')) {
			let balance = JSON.parse(Storage.get('info'));

			group = balance.group.alias;
		}



		this.state = {
			group: group
		}

        document.title = t('TITLE_USER_LK_PAGE', 'Личный кабинет');

	}
	render() {
		return (
			<div className="m2dashboard">
				<Header />
				<main className="m2dashboard_container">
					<section className="m2dash_section m2dash_navs">
						<NavControlls items={Config.CabinetNavs[this.state.group]}/>
					</section>
					<section className="m2dash_section m2dash_items">
						{(this.state.group == 'client' || this.state.group =='cooperator') ? <MainClient /> : <MainOwner />}
					</section>
				</main>
			</div>
		);
	} 
}


export default Cabinet;