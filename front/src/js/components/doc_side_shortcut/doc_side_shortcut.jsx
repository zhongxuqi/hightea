import React from 'react';

import './doc_side_shortcut.less'

export default class DocSideShortcut extends React.Component {
    render() {
        return (
            <div className="doc-side-shortcut clearfix">
                <h5 className="table-cell doc-side-shortcut-title"><a>{this.props.title}</a></h5>
                <div className="table-cell doc-side-shortcut-data">
                    <span className="glyphicon glyphicon-star"></span>
                    {this.props.likeNum}
                </div>
            </div>
        )
    }
}
