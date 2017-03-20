import React from 'react';

import Language from '../../language/language.jsx'

import './doc_side_shortcut.less'

export default class DocSideShortcut extends React.Component {
    render() {
        return (
            <div className="doc-side-shortcut clearfix lowtea-table">
                <h5 className="doc-side-shortcut-title lowtea-table-cell"><a onClick={(()=>{this.props.onClick(this.props.document)}).bind(this)}>
                    {this.props.document.title}
                </a></h5>
                <div className="dropdown lowtea-table-cell" style={{width:"1%"}}>
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
                        }).bind(this)}>{Language.textMap("Publish for self")}</a></li>
                        <li role="presentation"><a role="menuitem" href="javascript:void(0)" onClick={(()=>{
                            this.props.onPublishDoc({
                                id: this.props.document.id,
                                title: this.props.document.title,
                                content: this.props.document.content,
                                status: "status_publish_member",
                            })
                        }).bind(this)}>{Language.textMap("Publish for member")}</a></li>
                        <li role="presentation"><a role="menuitem" href="javascript:void(0)" onClick={(()=>{
                            this.props.onPublishDoc({
                                id: this.props.document.id,
                                title: this.props.document.title,
                                content: this.props.document.content,
                                status: "status_publish_public",
                            })
                        }).bind(this)}>{Language.textMap("Publish for public")}</a></li>
                    </ul>
                </div>
                <div className="lowtea-table-cell" style={{width:"1%", display:{true:"table-cell", false:"none"}[this.props.onDeleteDoc!=undefined]}}>
                    <button type="button" className="btn btn-default lowtea-doc-btn" 
                        onClick={(()=>{this.props.onDeleteDoc(this.props.document.id)}).bind(this)}>
                        <span className="fa fa-trash"></span>
                    </button>
                </div>
            </div>
        )
    }
}
