import React from 'react';

import Item from './Notifications/Item';
import * as M2Generator from '../library/M2Generators';



class Notifications extends React.Component {
	constructor(props) {
		super(props);
		
	}



	render() {
		let items = (this.props.items && this.props.items.length > 0) ? this.props.items : [];
		let className = (items.length == 0) ? 'm2notification_container m2hide_note' : 'm2notification_container';
		return (
			<div className={className}>
				{items.map((item, index) => <Item index={index} onRemove={this.props.remove} key={'item_notification_' + M2Generator.guid()} {...item}/>)}
			</div>
		);
	}
}


export default Notifications;