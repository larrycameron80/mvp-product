import React from 'react';

import FilterItem from './Filter/Item';
import FilterInputs from './Filter/FilterInputs';

class Filter extends React.Component {
	constructor(props) {
		super(props);
	}

	__submitHandle() {
		if(typeof this.props.submit != "undefined") {
			this.props.submit();
		}
	}

	render() {

		let filter_inputs = '';
		if(this.props.inputs) {
			filter_inputs = (<FilterInputs submit={this.__submitHandle.bind(this)} inputs={this.props.inputs}/>);
		}

		return (
			<div className={"m2dashboard_filter" + (!this.props.items ? " m2dashboard_filter_noborder" : "") + (this.props.className ? ' ' + this.props.className : '')}>
				{this.props.items && this.props.items.map(item => <FilterItem key={'admin_filter_' + item.title} {...item}/>)}
				{filter_inputs}
			</div>
		);
	}
}


export default Filter;