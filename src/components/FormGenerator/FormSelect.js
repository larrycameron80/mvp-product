import React from 'react';
import T, {t} from '../../components/Translate/Translate';

class FormSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: ''
		}
	}


	__change(event) {
		event.preventDefault();
		this.setState({
			value: event.target.value
		});

		if(typeof this.props.callback != "undefined") {
			this.props.callback(event.target.value);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps && nextProps.value) {
			this.setState({value: nextProps.value});
		}
	}




	render() {
		let options = [<option value="" key={'default_select_value'}>{this.props.default_value || "Выберете значение"}</option>];
		if(this.props.items) {
			for(var i in this.props.items) {
				let item = this.props.items[i];
				if(typeof item.id != "undefined" && typeof item.name != "undefined") {
                    options.push(<option key={'filter_item_default_' + this.props.name + '_' + item.id} value={item.id}>
                        {item['ph'] ? <T ph={item['ph']} def={item['def']}/> : item.name}
					</option>);
				} else {
                    options.push(<option key={'filter_item_default_' + this.props.name + '_' + i} value={i}>
                        {item['ph'] ? <T ph={item['ph']} def={item['def']}/> : item}
					</option>);
				}

			}
		}
		

		let className = ['m2form_input', 'm2form_custom_select'];
		
		if(this.props.className) {
			className.push(this.props.className);
		}

		return (
			<div className={className.join(' ')}>
				{this.props.label && <label>{this.props.ph ? <T ph={this.props.ph} def={this.props.label}/> : this.props.label}</label>}
				<select size="1" required={this.props.require ? true : false} value={this.state.value} onChange={this.__change.bind(this)}>
					{options}
				</select>
			</div>
		);
	}
}

export default FormSelect;