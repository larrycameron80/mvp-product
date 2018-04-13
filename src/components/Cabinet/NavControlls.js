import React from 'react';
import { Link } from 'react-router';


class NavControlls extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let items = [];

		if(this.props.items && this.props.items.length > 0) {
			this.props.items.map(item => items.push(<Link key={'admin_' + item.path} className={window.location.pathname == item.path ? 'active' : ''} to={item.path}>{item.title}</Link>));
		} 

		return (
			<div className="m2dashboard_content">
				{items}
			</div>
		);
	}
}


export default NavControlls;