import React from 'react'
import {Link} from 'react-router'

import DateUtils from '../../utils/date.jsx'
import TransUtils from '../../utils/trans.jsx'
import Language from '../../language/language.jsx'

import './doc_shortcut.less'

export default class DocShortcut extends React.Component {
    render() {
        return (
            <div className="doc-shortcut">
                <div className="clearfix lowtea-table">
                    <div className="lowtea-table-cell" style={{width:"1%"}}>
                        <h4 className="title"><Link to={"/doc_reader/"+this.props.document.id}>{this.props.document.title}</Link></h4>
                    </div>
                    <div className="lowtea-table-cell" style={{width:"99%"}}>
                        <span className="label label-info">{TransUtils.status2string(this.props.document.status)}</span>
                    </div>
                    {
                        {
                            false: null,
                            true: (
                                <div className="lowtea-table-cell" style={{width:"1%", paddingRight:"10px", display:{true:"table-cell", false:"none"}[this.props.onDeleteDoc!=undefined]}}>
                                    <a type="button" className="btn btn-default lowtea-doc-btn" 
                                        href={"#/doc_editor/" + this.props.document.id}>
                                        <span className="fa fa-pencil"></span>
                                    </a>
                                </div>
                            ),
                        }[this.props.isSelf]
                    }
                    <div className="lowtea-table-cell dropdown" style={{width:"1%", paddingRight:"10px", display:{true:"table-cell", false:"none"}[this.props.onSaveDoc!=undefined]}}>
                        <button className="btn btn-default dropdown-toggle lowtea-doc-btn" type="button" data-toggle="dropdown">
                            <span className="fa fa-toggle-down"></span>
                        </button>

                        <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                            <li role="presentation"><a role="menuitem" href="javascript:void(0)" onClick={(()=>{
                                this.props.onSaveDoc({
                                    id: this.props.document.id,
                                    title: this.props.document.title,
                                    content: this.props.document.content,
                                    status: "status_draft",
                                })
                            }).bind(this)}>{Language.textMap("draft")}</a></li>
                            <li role="presentation"><a role="menuitem" href="javascript:void(0)" onClick={(()=>{
                                this.props.onSaveDoc({
                                    id: this.props.document.id,
                                    title: this.props.document.title,
                                    content: this.props.document.content,
                                    status: "status_publish_self",
                                })
                            }).bind(this)}>{Language.textMap("publish for self")}</a></li>
                            <li role="presentation"><a role="menuitem" href="javascript:void(0)" onClick={(()=>{
                                this.props.onSaveDoc({
                                    id: this.props.document.id,
                                    title: this.props.document.title,
                                    content: this.props.document.content,
                                    status: "status_publish_member",
                                })
                            }).bind(this)}>{Language.textMap("publish for member")}</a></li>
                            <li role="presentation"><a role="menuitem" href="javascript:void(0)" onClick={(()=>{
                                this.props.onSaveDoc({
                                    id: this.props.document.id,
                                    title: this.props.document.title,
                                    content: this.props.document.content,
                                    status: "status_publish_public",
                                })
                            }).bind(this)}>{Language.textMap("publish for public")}</a></li>
                        </ul>
                    </div>
                    <div className="lowtea-table-cell" style={{width:"1%", display:{true:"table-cell", false:"none"}[this.props.onDeleteDoc!=undefined]}}>
                        <button type="button" className="btn btn-default lowtea-doc-btn" 
                            onClick={(()=>{this.props.onDeleteDoc(this.props.document.id)}).bind(this)}>
                            <span className="fa fa-trash"></span>
                        </button>
                    </div>
                </div>
                <p className="doc-shortcut-abstract">{this.props.document.content.substring(0,100)}</p>
                <div className="doc-shortcut-data clearfix lowtea-table">
                    <div className="lowtea-table-cell">
                        <span className="label label-info lowtea-badge-account">{this.props.document.account}</span>
                    </div>
                    <div className="lowtea-table-cell">
                        <span className="glyphicon glyphicon-star"></span>
                        {this.props.document.starNum}
                    </div>
                    <div className="lowtea-table-cell">
                        <span className="glyphicon glyphicon-pencil"></span>
                        { DateUtils.unixtime2String(this.props.document.modifyTime) }
                    </div>
                </div>
            </div>
        )
    }
}
