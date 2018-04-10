import React from 'react';

import Items from './ItemsGenerator/Item';
import T, {t} from '../components/Translate/Translate';

class ItemsGenerator extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let componentRender = <div className="m2dashboard_notfound"><T ph="LBL_NO_ELEMENTS_FOUND" def="Элементов не найдено"/></div>;
		let result_items = [];

		if(this.props.items && this.props.options) {
			for(var i in this.props.items) {
				let global_item = this.props.items[i];
				let item = {};
				//generate item sections
				for(var j in this.props.options) {
					item[j] = {};
					for(var g in this.props.options[j]) {
						let field = this.props.options[j][g];
						if(global_item[field.field]) {
							if(!item[j]) item[j] = {};
							if(field.getValue) {
								item[j][field.field] = field.getValue(global_item[field.field]);
							} else {
								item[j][field.field] = global_item[field.field];
							}
						}
					}
				}
				result_items.push(item);
			}
		}

		let component_items = [];
		if(result_items.length > 0) {
			result_items.map(item => component_items.push(<Items key={item.main.id} {...item}/>));
			componentRender = component_items;
		}

		return (
			<div className="m2dashboard_items">
				{componentRender}
			</div>
		)
	}
}

export default ItemsGenerator;