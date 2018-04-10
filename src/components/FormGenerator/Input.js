import React from 'react';
import T, {t} from '../../components/Translate/Translate';

class Input extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: ''
		}
	}

	__change(event) {
		event.preventDefault();
		this.setState({value: event.target.value});

		
	}

	updateParent() {
		if(typeof this.props.callback != "undefined") {
			this.props.callback(this.state.value);
		}
	}


	componentWillReceiveProps(nextProps) {
		if(nextProps && nextProps.value) {
			this.setState({value: nextProps.value});
		}
	}

	render() {
		return (
			<div className="m2form_input m2form_text_input">
				{this.props.label && <label>{this.props.ph ? <T ph={this.props.ph} def={this.props.label}/> : this.props.label}</label>}
				<input 
					onChange={this.__change.bind(this)} 
					type={this.props.inputType ? this.props.inputType : 'text'} 
					value={this.state.value} 
					placeholder={this.props.placeholder} 
					required={this.props.require ? true : false}
					onBlur={this.updateParent.bind(this)}
				/>
			</div>
		);
	}

}

export default Input;