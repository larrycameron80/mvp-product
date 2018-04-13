import React from 'react';
import { Link } from 'react-router';
import T, {t} from '../../components/Translate/Translate';

import Actions from './Items/LastActions';
import Placements from './Items/LastPlacements';
import LastCampaigns from './Items/LastCampaigns';
import Users from './Items/Users';
import Campaigns from './Items/Campaigns';
import Platforms from './Items/Platforms';
import UserList from './Items/UserList';
import UserStats from './Items/UserStats';
import UserBills from './Items/UserBills';
import OwnerPage from './Items/OwnerPage';
import Coorps from './Items/Coorp';


class Items extends React.Component {
	constructor(props) {
		super(props);
	}
	__incPage(event) {
		event.preventDefault();

		if(typeof this.props.incPage != "undefined") {
			this.props.incPage();
		}
	}

	render() {
		let user_group = (this.props.user_group) ? this.props.user_group : 'client';
		let componentRender = <div className="m2dashboard_notfound"><T ph="LBL_NO_ELEMENTS_FOUND" def="Элементов не найдено"/></div>;
		if(this.props.type && this.props.items && (this.props.items.length > 0 || this.props.items.top)) {

			switch(this.props.type) {
				case "actions": componentRender = <Actions items={this.props.items} />; break;
				case "placements": componentRender = <Placements items={this.props.items} />; break;
				case "campaigns": componentRender = <LastCampaigns items={this.props.items} />; break;
				case "users": componentRender = <Users items={this.props.items} />; break;
				case "user_campaigns": componentRender = <Campaigns items={this.props.items} />; break;
				case "user_platforms": componentRender = <Platforms addBookmark={this.props.addBookmark} removeBookmark={this.props.removeBookmark} items={this.props.items} />; break;
				case "user_list": componentRender = <UserList removeItem={this.props.removeItem} items={this.props.items} />; break;
				case "user_stats": componentRender = <UserStats items={this.props.items} />; break;
				case "user_bills": componentRender = <UserBills user_group={this.props.user_group} addItem={this.props.addItem} users={this.props.users} items={this.props.items} />; break;
				case "owner_main_page": componentRender = <OwnerPage removeBookmark={this.props.removeBookmark} addBookmark={this.props.addBookmark} items={this.props.items}/>;break;
				case "coorps": componentRender = <Coorps remove={this.props.remove} update={this.props.update} add={this.props.add} items={this.props.items}/>;break;
			}
		} else {
			if(this.props.type == 'user_bills') {
				componentRender = <UserBills user_group={this.props.user_group} addItem={this.props.addItem} users={this.props.users} items={this.props.items} />;
			}
			if(this.props.type == 'coorps') {
                componentRender = <Coorps remove={this.props.remove} update={this.props.update} add={this.props.add} items={this.props.items}/>;
			}
		}



		return (
			<div className="m2dashboard_items">
				{componentRender}

				{this.props.options && this.props.options.pr > 1 ? 
						<div className="m2dashboard_load_more"><Link onClick={this.__incPage.bind(this)} to="#"><T ph="LBL_SHOW_MORE" def="Показать еще"/></Link></div> : ''}
			</div>
		)
	}
}

export default Items;