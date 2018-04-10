import React from 'react';
import { Link } from 'react-router';
import T, {t} from '../../components/Translate/Translate';

class Item extends React.Component{
	constructor(props) {
		super(props);
	}

	render() {
		let className = [];
		if((window.location) && window.location.pathname == this.props.path){
			className.push('active');
		}

		if(this.props.state_classes) {
			className.push(this.props.state_classes)
		}
		return <Link className={className.join(' ')} to={this.props.path}><T ph={this.props.ph} def={this.props.title}/></Link>
	}
}


export default Item;