import React from 'react';

import TRow from './TRow';


class TBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let table_rows =[];
        if(this.props.items) {
            let columns = this.props.columns;
            this.props.items.map(function(item) {
                table_rows.push(<TRow key={'table_item_' + item.id} {...item} columns={columns} editable={true}/>)
            });
        }
        return (<tbody>{table_rows}</tbody>)
    }
}

export default TBody;