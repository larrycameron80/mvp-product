import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import T, {t} from '../../components/Translate/Translate';

class CustomRadio extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: []
		}
	}

	__change(event) {
		event.preventDefault();
		let val = 0;
		if(typeof event.target.attributes['data-id'] == "undefined") {
            val = $(event.target).closest('a').data('id');
		} else {
            val = event.target.attributes['data-id'].value;
		}

		// let val = event.target.attributes['data-id'].value;
		let current_values = this.state.value;
		if(current_values.indexOf(val) + 1 > 0) {
			current_values.splice(current_values.indexOf(val), 1);
		} else {
			current_values.push(val);
		}

		this.setState({value: current_values});
		
		if(typeof this.props.callback != "undefined") {
			this.props.callback(val);
		}
	}

	render() {
		let items = [];

		if(this.props.items) {
			for(var i in this.props.items) {
				let item = this.props.items[i];
				let className = '';



				if(typeof this.props.value == "object") {
                    className = (this.props.value[i]) ? 'active' : '';
				} else {
                    className = (this.props.value && this.props.value[0] && this.props.value[0].indexOf(i) + 1 > 0) ? 'active' : '';
				}
				// let className = (this.props.value && this.props.value[0] && this.props.value[0].indexOf(i) + 1 > 0) ? 'active' : '';
				items.push(
					<Link className={className} onClick={this.__change.bind(this)} key={'item_custom_' + (item['ph'] ? item['ph'] : item)} to='#' data-id={i}>
						{item['ph'] ? <T ph={item['ph']} def={item['def']}/> : item}
					</Link>
				)
			}
			
		}

		return (
			<div className="m2form_input m2form_custom_radio">
				{this.props.label && <label>{this.props.ph ? <T ph={this.props.ph} def={this.props.label}/> : this.props.label}</label>}
				<div className="m2radio">{items}</div>
			</div>
		);
	}
}

export default CustomRadio;