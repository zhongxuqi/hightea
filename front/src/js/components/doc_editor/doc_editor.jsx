import React from 'react';

import DocSideShortcut from '../doc_side_shortcut/doc_side_shortcut.jsx'
import MarkdownEditor from '../markdown_editor/markdown_editor.jsx'
import HttpUtils from '../../utils/http.jsx'

import './doc_editor.less'

export default class DocEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            content: "",
            status: "status_draft",
        }
    }

    componentDidMount() {
        this.refs.editor.setValue(this.state.content)
    }

    saveDoc() {
        let action
        let document
        if (this.state.id == null || this.state.id.length == 0) {
            action = "add"
            document = {
                title: this.state.title,
                content: this.state.content,
                status: this.state.status,
            }
        } else {
            action = "edit"
            document = {
                id: this.state.id, 
                title: this.state.title,
                content: this.state.content,
                status: this.state.status,
            }
        }
        console.log(document)
        
        HttpUtils.post("/api/member/document", {
            action: action,
            document: document,
        }, ((resp)=>{
            if (action == "add") this.setState({id:resp.id})
        }).bind(this), (resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.resonpseText)
        })
    }

    render() {
        return (
            <div className="clearfix" style={{height:"100%"}}>
                <div className="col-md-3 col-xs-3 lowtea-docs-sidebar">
                    <div className="side-searchbar">
                        <input className="form-control" placeholder="请输入关键词"/>
                        <button className="btn btn-default"><span className="glyphicon glyphicon-search"></span></button>
                    </div>
                    <ul className="docs-list">
                        <li className="docs-list-item btn-new-doc">
                            <a><span className="glyphicon glyphicon-plus"></span>添加新文章</a>
                        </li>
                        <li className="docs-list-item">
                            <DocSideShortcut title="文章标题" likeNum="1"></DocSideShortcut>
                        </li>
                    </ul>
                </div>

                <div className="col-md-9 col-xs-9 lowtea-doc-editor">
                    <div className="doc-title clearfix">
                        <div className="table-cell" style={{width:"99%"}}>
                            <input className="doc-title-input" placeholder="标题" value={this.state.title} onChange={((event)=>{this.setState({title:event.target.value})}).bind(this)}/>
                        </div>
                        <div className="table-cell" style={{width:"1%"}}>
                            <span className="badge">{{"status_draft":"草稿","status_publish_self":"仅自己可见","status_publish_member":"内部可见","status_publish_public":"公开"}[this.state.status]}</span>
                        </div>
                        <div className="table-cell" style={{width:"1%"}}>
                            <div className="dropdown">
                                <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                                    操作
                                    <span className="caret"></span>
                                </button>

                                <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                                    <li role="presentation"><a role="menuitem" href="javascript:void(0)" onClick={(()=>{
                                        this.setState({status:"status_publish_self"})
                                        this.saveDoc()
                                    }).bind(this)}>发布(仅自己可见)</a></li>
                                    <li role="presentation"><a role="menuitem" href="javascript:void(0)">发布(仅成员可见)</a></li>
                                    <li role="presentation"><a role="menuitem" href="javascript:void(0)">发布(对外公开)</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="table-cell" style={{width:"1%"}}>
                            <button type="button" className="btn btn-default" onClick={this.saveDoc.bind(this)}><span className="glyphicon glyphicon-floppy-disk" style={{marginRight:"5px"}}></span>保存</button>
                        </div>
                    </div>

                    <MarkdownEditor ref="editor" onChange={((value)=>{
                        this.setState({content:value})
                    }).bind(this)}></MarkdownEditor>
                </div>
            </div>
        )
    }
}
