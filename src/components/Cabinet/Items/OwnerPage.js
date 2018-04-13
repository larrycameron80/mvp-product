/**
 * Created by awd on 27.07.17.
 */
import React from 'react';


import Bookmark from './OwnerPage/Bookmark';
import Top from './OwnerPage/Top';

class OwnerPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="m2dash_sections">
                {(this.props.items && this.props.items.bookmarks && this.props.items.bookmarks.length > 0) ? <Bookmark removeBookmark={this.props.removeBookmark} items={this.props.items.bookmarks} /> : ''}
                <Top addBookmark={this.props.addBookmark} items={(this.props.items && this.props.items.top) ? this.props.items.top : []} />
            </div>
        );
    }
}

export default OwnerPage;