import React from 'react';

import Item from './Navigation/Item';
import TranslateSelect from './Translate/TranslateSelect';

class Navigation extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let items = (this.props.navigation && this.props.navigation.length > 0) ? this.props.navigation : [];

		return (<nav>
					{items.map(item => <Item key={'navigation_' + item.path} {...item} />)}
					<TranslateSelect extraClass="not_mobile"/>
				</nav>);
	}
}


export default Navigation;