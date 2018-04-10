import React from 'react';
import { Link } from 'react-router';

class Item extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            name: props.name || '',
            id: props.id || '',
            country_id: props.country_id || '',
            alias: props.alias || ''
        }
    }

    __changeHandle(event) {
        let name = event.target.name;
        let state = this.state;
        if(state[name]) {
            state[name] = event.target.value;
            this.setState(state);
        }
    }

    componentWillReceiveProps(prop) {
        let state = this.state;
        if(prop.name) state.name = prop.name;
        if(prop.id) state.id = prop.id;
        if(prop.country_id) state.country_id = prop.country_id;
        if(prop.alias) state.alias = prop.alias;
        this.setState(state);
    }

    __remove(event) {
        event.preventDefault();
        this.props.remove(this.props.index);
    }
    __moveUp(event) {
        event.preventDefault();
        if(this.props.index > 0) {
            this.props.up(this.props.index);
        }
    }

    render() {
        let items = [];

        if(this.state.alias == 'city') {
            if(this.props.country_list) {
                this.props.country_list.map(item => items.push(<option value={item.id} key={this.state.alias + '_' + this.state.id + '_city_' + item.id}>{item.name}</option>))
            }
        }

        return (
            <tr>
                <td><input name="name" value={this.state.name} onChange={this.__changeHandle.bind(this)}/></td>
                {this.state.alias == 'city' && <td><select size="1" defaultValue={this.state.country_id} name="country_id">{items}</select></td>}
                <td width="20"><Link onClick={this.__moveUp.bind(this)} href="#" className={this.props.index == 0 ? "item_up unactive" : "item_up"}></Link></td>
                <td width="20"><Link onClick={this.__remove.bind(this)} href="#" className="item_remove"></Link></td>
            </tr>
        );
    }
}

export default Item;