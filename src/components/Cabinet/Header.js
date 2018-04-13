import React from 'react';
import { Link, browserHistory } from 'react-router';

import T, {t} from '../../components/Translate/Translate';
import M2Store from '../../library/M2Store';
import * as M2Format from '../../library/M2Format';


const Storage = new M2Store();

class Header extends React.Component {
	constructor(props) {
		super(props);
		let info = {
			balance: 0
		};

		if(Storage.get('info')) {
			let balance = JSON.parse(Storage.get('info'));
			info.balance = balance.balance;
			info.group_alias = balance.group.alias;

			info.group == (balance.group.alias == 'client') ? 'Рекламодателя' : 'Владельца площадок';
		}
	


		this.state = {
			info: info
		};
	}

    __logoutUser(event) {
		event.preventDefault();
        Storage.remove('access_token');
        Storage.remove('info');
     	window.location.href = '/signin';
        // setTimeout(function(){
        // 	browserHistory.push('/signin');
        // }, 1000);
	}

	render() {
		return (
			<header className="m2dashboard_container m2dash_menu_cabinet">
				<div className="m2dashboard_content">
					<div className="m2dash2 brand">
						<Link to="/cp"><img src="/images/adrenta_logo.svg" style={{width: '132px'}}/></Link>
					</div>
					<div className="m2dash7 m2dash_nav">
						{(this.state.info.group_alias == 'client' || this.state.info.group_alias == 'cooperator') ? <Link to="/cp/campaigns/add"><T ph="CR_CAMPAIGN_BTN" def="Создать кампанию" /></Link> : <Link to="/cp/platforms/add"><T ph="CR_PLATFORM_BTN" def="Создать площадку" /></Link>}
						{this.state.info.group_alias !== 'cooperator' && <Link className="m2bills_link" to="/cp/bills">{this.state.info.balance ? M2Format.numberFormat(this.state.info.balance,0,'',' ') : 0} ₽</Link>}
					</div>
					<div className="m2dash1 m2dash_line m2dash_overflow">
						<Link href="#" onClick={this.__logoutUser.bind(this)} className="adminMenu">
							Выйти
						</Link>
					</div>
				</div>
			</header>
		);
	}
}

export default Header;