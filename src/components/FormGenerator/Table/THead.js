import React from 'react';

import TRow from './TRow';


class THead extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<thead><TRow columns={this.props.columns} /></thead>)
    }
}

export default THead;