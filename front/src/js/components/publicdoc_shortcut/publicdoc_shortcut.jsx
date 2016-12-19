import React from 'react'
import {Link} from 'react-router'

import DateUtils from '../../utils/date.jsx'
import TransUtils from '../../utils/trans.jsx'

import './publicdoc_shortcut.less'

export default class PublicDocShortcut extends React.Component {
    render() {
        return (
            <div className="publicdoc-shortcut">
                <div className="clearfix lowtea-table">
                    <div className="lowtea-table-cell" style={{width:"99%"}}>
                        <h4 className="title"><Link to={"/publicdoc_reader/"+this.props.document.id}>{this.props.document.title}</Link></h4>
                    </div>
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
                            }).bind(this)}>草稿</a></li>
                            <li role="presentation"><a role="menuitem" href="javascript:void(0)" onClick={(()=>{
                                this.props.onSaveDoc({
                                    id: this.props.document.id,
                                    title: this.props.document.title,
                                    content: this.props.document.content,
                                    status: "status_publish_self",
                                })
                            }).bind(this)}>发布(仅自己可见)</a></li>
                            <li role="presentation"><a role="menuitem" href="javascript:void(0)" onClick={(()=>{
                                this.props.onSaveDoc({
                                    id: this.props.document.id,
                                    title: this.props.document.title,
                                    content: this.props.document.content,
                                    status: "status_publish_member",
                                })
                            }).bind(this)}>发布(仅成员可见)</a></li>
                            <li role="presentation"><a role="menuitem" href="javascript:void(0)" onClick={(()=>{
                                this.props.onSaveDoc({
                                    id: this.props.document.id,
                                    title: this.props.document.title,
                                    content: this.props.document.content,
                                    status: "status_publish_public",
                                })
                            }).bind(this)}>发布(对外公开)</a></li>
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
                <ul className="doc-shortcut-data clearfix">
                    <li>
                        <span className="glyphicon glyphicon-star"></span>
                        {this.props.document.starNum}
                    </li>
                    <li>
                        <span className="glyphicon glyphicon-pencil"></span>
                        { DateUtils.unixtime2String(this.props.document.modifyTime) }
                    </li>
                </ul>
            </div>
        )
    }
}
