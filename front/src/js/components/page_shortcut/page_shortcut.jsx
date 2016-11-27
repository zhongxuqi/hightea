import React from 'react';

import './page_shortcut.less'

export default class PageShortcut extends React.Component {
    render() {
        return (
            <div className="page-shortcut">
                <h4><a>{this.props.title}</a></h4>
                <p className="page-shortcut-abstract">{this.props.abstract}</p>
                <ul className="page-shortcut-data clearfix">
                    <li>
                        <span className="glyphicon glyphicon-star"></span>
                        {this.props.likeNum}
                    </li>
                    <li>
                        <span className="glyphicon glyphicon-pencil"></span>
                        {this.props.updateTime + " by " + this.props.updateUser}
                    </li>
                </ul>
            </div>
        )
    }
}