import React from 'react';
import { Link } from 'react-router';

import Item from './Popup/Item';
import T, {t} from '../components/Translate/Translate';

class ListPopup extends React.Component {
    constructor(props) {
        super(props);
        let max_id = 0;
        if(props.popup && props.popup.items) {
            max_id = props.popup.items[0].id;
            props.popup.items.map(function(item) {
                if(item.id > max_id) max_id = item.id;
            })
        }

        this.state = {
            name: '',
            country_id: '',
            id: '',
            items: (props.popup && props.popup.items) ? props.popup.items :  [],
            max_id: max_id,
        }
    }

    __formSubmit(event) {
        event.preventDefault();
        this.props.update(this.props.popup.alias, this.state.items);
    }

    componentWillReceiveProps(props) {
        if(props.popup_info && props.popup_info.items) {
            let max_id = 0;
            if(props.popup && props.popup.items) {
                let max_id = props.popup.items[0];
                props.popup.items.map(function(item) {
                    if(item.id > max_id) max_id = item.id;
                })
            }
            this.setState({items: props.popup_info.items, max_id: max_id});
        }
    }

    __changeName(event) {
        this.setState({name: event.target.value});
    }

    __changeCountry(event) {
        this.setState({country_id: event.target.value});
    }

    __close(event) {
        event.preventDefault();
        this.props.close();
    }


    moveUp(index) {
        let items = this.state.items;
        let buff = items[index - 1];
        items[index - 1] = items[index];
        items[index] = buff;
        this.setState({items: items});
    }


    remove(index) {
        let items = this.state.items;
        items.splice(index, 1);
        this.setState({items: items});
    }


    __addItem(event) {
        event.preventDefault();
        if(this.state.name.length > 0) {
           let items = this.state.items;
           let id = this.state.max_id + 1
           if(this.props.popup.alias == 'city') {
               items.push({
                   id: id,
                   name: this.state.name,
                   country_id: this.state.country_id
               });
           } else {
               items.push({
                   id: id,
                   name: this.state.name
               });
           }


           this.setState({
               name: '',
               country_id: '',
               items: items,
               max_id: id
           })

        }
    }

    render() {
        let items = [];
        let edit_items = this.state.items;

        if(this.props.popup.alias == 'city' && this.props.popup.country_list) {
            this.props.popup.country_list.map(item => items.push(<option value={item.id} key={'new_city_item_' + item.id}>{item.name}</option>))
        }
        return (
            <div className="list_popup">
                <div className="list_popup_container">
                    <div className="title">{this.props.popup.name}</div>
                    <div className="items">
                        <form method="POST" onSubmit={this.__formSubmit.bind(this)}>
                            <div className="table_container">
                                <table className="m2table">
                                    <tbody>
                                    {edit_items.map((item,index) => <Item up={this.moveUp.bind(this)} remove={this.remove.bind(this)} index={index} country_list={this.props.popup.country_list || false} alias={this.props.popup.alias} key={this.props.popup.alias + '_items_' + item.id} {...item}/>)}
                                    <tr>
                                        <td><input type="text" name="name" value={this.state.name} onChange={this.__changeName.bind(this)}/></td>
                                        {this.props.popup.alias == 'city' && <td><select size="1" defaultValue={this.state.country_id} onChange={this.__changeCountry.bind(this)} name="country_id">{items}</select></td>}
                                        <td width="20"><Link href="#" className="item_up unactive"></Link></td>
                                        <td width="20"><Link href="#" onClick={this.__addItem.bind(this)} className={this.state.name.length == 0 ? "item_add unactive" : "item_add"}></Link></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="button_container">
                                <button type="submit"><T ph="LBL_SAVE" def="Сохранить"/></button>
                            </div>
                        </form>
                    </div>
                </div>
                <Link href="#" onClick={this.__close.bind(this)} className="close_popup"></Link>
            </div>
        );
    }
}

export default ListPopup;
