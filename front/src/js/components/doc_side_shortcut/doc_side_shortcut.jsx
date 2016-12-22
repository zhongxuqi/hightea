import React from 'react';

import './doc_side_shortcut.less'

export default class DocSideShortcut extends React.Component {
    render() {
        return (
            <div className="doc-side-shortcut clearfix">
                <h5 className="table-cell doc-side-shortcut-title"><a onClick={(()=>{this.props.onClick(this.props.document.id)}).bind(this)}>{this.props.document.title}</a></h5>
                <div className="table-cell doc-side-shortcut-data">
                    <span className="glyphicon glyphicon-star"></span>
                    {this.props.document.starNum}
                </div>

                <div className="table-cell dropdown" style={{width:"1%"}}>
                    <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                        <span className="fa fa-toggle-down"></span>
                    </button>

                    <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                        <li role="presentation"><a role="menuitem" href="javascript:void(0)" onClick={(()=>{
                            this.props.onPublishDoc({
                                id: this.props.document.id,
                                title: this.props.document.title,
                                content: this.props.document.content,
                                status: "status_publish_self",
                            })
                        }).bind(this)}>发布(仅自己可见)</a></li>
                        <li role="presentation"><a role="menuitem" href="javascript:void(0)" onClick={(()=>{
                            this.props.onPublishDoc({
                                id: this.props.document.id,
                                title: this.props.document.title,
                                content: this.props.document.content,
                                status: "status_publish_member",
                            })
                        }).bind(this)}>发布(仅成员可见)</a></li>
                        <li role="presentation"><a role="menuitem" href="javascript:void(0)" onClick={(()=>{
                            this.props.onPublishDoc({
                                id: this.props.document.id,
                                title: this.props.document.title,
                                content: this.props.document.content,
                                status: "status_publish_public",
                            })
                        }).bind(this)}>发布(对外公开)</a></li>
                    </ul>
                </div>
            </div>
        )
    }
}
