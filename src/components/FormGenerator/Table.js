import React from 'react';


import THead from './Table/THead';
import TBody from './Table/TBody';

class Table extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="m2table_container">
                <table className="m2table">
                    <THead columns={this.props.columns} />
                    <TBody items={this.props.items} columns={this.props.columns} />
                </table>
            </div>)
    }
}

export default Table;