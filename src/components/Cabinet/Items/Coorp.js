import React from 'react';
import { Link } from 'react-router';

import * as M2Format from '../../../library/M2Format';
import Popup from './Coorp/Popup';
import Item from './Coorp/Item';
import T, {t} from '../../../components/Translate/Translate';

class Coorps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            add_popup: false,
        }
    }

    __openAddPopup(event) {
        event.preventDefault();
        this.setState({add_popup: true});
    }

    __closeAddPopup() {

        this.setState({add_popup: false});
    }

    __addUser(data) {
       this.props.add(data);
       this.setState({add_popup: false});

    }

    __updateUser(id, data) {
        this.props.update(id, data);
    }


    render() {



        return (
            <div className="m2dash_section_coorp">

                <div className="coorp_info"><T ph="USERS_INFO_1" def="Вы всегда можете посмотреть и редактировать данные ваших сотрудников, а так же добавить новых. Сейчас у вас" /> <b>{this.props.items.length || 0} <T ph="USERS_INFO_2" def="сотрудников" val={this.props.items.length} />.</b></div>
                <div className="m2dashboard_action_items">
                    {this.props.items.map(item => <Item remove={this.props.remove} update={this.__updateUser.bind(this)} key={"client_users_" + item._id} {...item} />)}
                    <div className="m2dash_item m2dash_item_create add_coorp">
                        <Link onClick={this.__openAddPopup.bind(this)} href="#"><T ph="LBL_ADD" def="Добавить"/></Link>
                    </div>
                </div>
                {this.state.add_popup && <Popup closePopup={this.__closeAddPopup.bind(this)} new={true} add={this.__addUser.bind(this)}/>}
            </div>
        );
    }
}

export default Coorps;