import React from 'react';
import { Link } from 'react-router';

class CustomRadioFix extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: {}
		}
	}

	__change(event) {
		event.preventDefault();
		let val = event.target.attributes['data-id'].value;
		let values = this.state.value;
		if(values[val]) {
			delete values[val];
		} else {
			values[val] = this.props.items[val];
		}


		// let current_values = this.state.value;
		// if(current_values.indexOf(val) + 1 > 0) {
		// 	current_values.splice(current_values.indexOf(val), 1);
		// } else {
		// 	current_values.push(val);
		// }

		this.setState({value: values});
		
		if(typeof this.props.callback != "undefined") {
			this.props.callback(values);
		}
	}

	componentWillReceiveProps(props) {
		if(props.value) {
			this.setState({value: props.value});
		}
	}

	render() {
		let items = [];
		
		if(this.props.items) {
		
			for(var i in this.props.items) {
				let item = this.props.items[i];
				let className = (this.state.value[i]) ? 'active' : '';
				items.push(<Link className={className} onClick={this.__change.bind(this)} key={'item_custom_' + item} to='#' data-id={i}>{item}</Link>)
			}
			
		}

		return (
			<div className="m2form_input m2form_custom_radio">
				{this.props.label && <label>{this.props.label}</label>}
				<div className="m2radio">{items}</div>
			</div>
		);
	}
}

export default CustomRadioFix;