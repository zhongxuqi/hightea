import React from 'react';

import './page_side_shortcut.less'

export default class PageSideShortcut extends React.Component {
    render() {
        return (
            <div className="page-side-shortcut clearfix">
                <h5 className="table-cell page-side-shortcut-title"><a>{this.props.title}</a></h5>
                <div className="table-cell page-side-shortcut-data">
                    <span className="glyphicon glyphicon-star"></span>
                    {this.props.likeNum}
                </div>
            </div>
        )
    }
}