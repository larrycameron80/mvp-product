/**
 * Created by WorldWifiTeam
 */

import React from 'react';
import {Link} from 'react-router';
import M2Store from '../../library/M2Store';
import T, {t} from '../../components/Translate/Translate';

const Storage = new M2Store();

let info = JSON.parse(Storage.get('info'));


class TranslatePopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: props.values,
        };
    }

    __changeHandler(event) {
        event.preventDefault();
        let name = event.target.name;
        let values = this.state.values;
        if(typeof values[name] != 'undefined') {
            values[name] = event.target.value;
            this.setState({values: values});
        }
    }

    __submitHandler() {
        this.props.updateCaption(this.state.values);
    }

    __clickHandler(event) {
        event.preventDefault();
    }

    render() {
        let change = this.__changeHandler.bind(this);
        return (
            <span onClick={this.__clickHandler.bind(this)} className="trPopupContainer">
                <span className="trPopupContent">
                    <span>{'{' + this.props.ph + '}'}</span>
                    {this.props.def && <span className="def">В верстке: {this.props.def}</span>}
                    <span className="trRow">
                        <input type="text" name="0" value={this.props.values[0]} onChange={change}/>
                    </span>
                    <span className="trRow">
                        <input type="text" name="1" value={this.props.values[1]} onChange={change}/>
                    </span>
                    <span className="trRow">
                        <input type="text" name="2" value={this.props.values[2]} onChange={change}/>
                    </span>
                    <span className="trRow">
                        <button type="submit" onClick={this.__submitHandler.bind(this)}>Сохранить</button>
                    </span>
                </span>
            </span>
        );
    }
}

export default TranslatePopup;