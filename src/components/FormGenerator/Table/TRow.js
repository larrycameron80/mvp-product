import React from 'react';
import T, {t} from '../../../components/Translate/Translate';


class TRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    __changeHandler(event) {
        let state = this.state;
        if(!state[event.target.name]) state[event.target.name] = '';
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    __saveHandler(event) {
        event.preventDefault();
        let id = this.props.id;
        let fields = [];
        this.props.columns.map(item => fields.push(item.name));
        let col = this.props.columns[fields.indexOf(event.target.name)];

        let data = this.state;
        data.id = id;
        if(col && typeof col.callback != "undefined") {
            col.callback(data);
        }
    }

    render() {
        let columns = [];

        if(this.props.editable) {
           if(this.props.columns) {
               let fields = [];
               this.props.columns.map(item => fields.push(item.name));
               for(var i in this.props) {
                   if(fields.indexOf(i) + 1 > 0) {
                       let col = this.props.columns[fields.indexOf(i)];
                       let value = (this.state && this.state[col.name]) ? this.state[col.name] : this.props[i];
                       switch(col.type) {
                           case 'input':
                               columns.push(<td key={"table_column_item_" + this.props.id + '_' + i}><textarea value={value} name={col.name} onChange={this.__changeHandler.bind(this)}  /></td>)
                               break;
                           case 'button':
                               columns.push(<td key={"table_column_item_" + this.props.id + '_' + i}><button name={col.name} onClick={this.__saveHandler.bind(this)} type="button">{col.ph ? <T ph={col.ph} def={col.buttonText} name={col.name}/> : col.buttonText}</button></td>);
                               break;
                           default:  columns.push(<td key={"table_column_item_" + this.props.id + '_' + i}>{this.props[i] || ''}</td>); break;
                       }

                   }
               }

           }
        } else {
            if(this.props.columns) {
                this.props.columns.map(function(c) {
                    let title = c.ph ? <T ph={c.ph} def={c.title}/> : c.title;
                    columns.push(<td key={"table_column_" + c.name}>{title || ''}</td>)
                });
            }
        }



        return (<tr>{columns}</tr>)
    }
}

export default TRow;