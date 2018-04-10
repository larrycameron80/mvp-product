import React from 'react';

import Input from './FormGenerator/Input';
import CustomRadio from './FormGenerator/CustomRadio';
import CustomRadioFix from './FormGenerator/CustomRadioFix';
import FormSelect from './FormGenerator/FormSelect';
import Date from './FormGenerator/Date';
import Time from './FormGenerator/Time';
import Textarea from './FormGenerator/TextArea';
import Table from './FormGenerator/Table';
import T, {t} from '../components/Translate/Translate';

class FormGenerator extends React.Component{
	constructor(props) {
		super(props);
	}

	render() {
		let sections = [];

		if(this.props.sections) {
			for(var i in this.props.sections) {
				let items = [];
				let section = this.props.sections[i];

				section.rows.map(function(row, index) {
					let row_fields = [];
					row.fields.map(function(field) {
						switch(field.type) {
							case 'text':
								row_fields.push(<Input key={'field_form_' + field.name} {...field}/>);
							break;
							case 'custom_radio':
								row_fields.push(<CustomRadio key={'field_form_' + field.name} {...field}/>);
							break;
							case 'custom_radio_fix':
								row_fields.push(<CustomRadioFix key={'field_form_' + field.name} {...field}/>);
							break;
							case 'select':
								row_fields.push(<FormSelect key={'field_form_' + field.name} {...field}/>);
							break;
							case 'date':
								row_fields.push(<Date key={'field_form_' + field.name} {...field}/>);
							break;
							case 'time':
								row_fields.push(<Time key={'field_form_' + field.name} {...field}/>);
							break;
                            case 'textarea':
                                row_fields.push(<Textarea key={'field_form_' + field.name} {...field}/>);
                             break;
							case 'table':
								row_fields.push(<Table key={'field_form_' + field.name} {...field}/>);
								break;
						}
					});
					items.push(<div key={'form_section_row_' + index} className={"m2dash_form_row" + (row.className ? ' ' + row.className : '')}>{row_fields}</div>);
				});
				

				sections.push(
					<section key={'form_section_' + i} className="m2dash_form_section">
						{section.title && <div className="m2dash_form_section_title">{section.title_ph ? <T ph={section.title_ph} def={section.title}/> : section.title}</div>}
						<div className="m2dash_from_section_fields">{items}</div>
					</section>
				);
			}
			
		}


		return (
			<div className="m2dash_form">
				{sections}
			</div>
		);
	}
}

export default FormGenerator;