import React from 'react';

import DocSideShortcut from '../doc_side_shortcut/doc_side_shortcut.jsx'
import MarkdownEditor from '../markdown_editor/markdown_editor.jsx'
import HttpUtils from '../../utils/http.jsx'

import './doc_editor.less'

export default class DocEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pageSize: 10,
            pageIndex: 0,
            drafts: [],
            document: {
                title: "",
                content: "",
                status: "status_draft",
            },
        }

        this.getDrafts(this.state.pageSize, this.state.pageIndex)
    }

    componentDidMount() {
        this.refs.editor.setValue(this.state.document.content)
    }

    getDrafts(pageSize, pageIndex) {
        HttpUtils.get("/api/member/drafts", {
            pageSize: pageSize,
            pageIndex: pageIndex,
        }, ((resp)=>{
            if (resp.documents != null) this.setState({drafts:resp.documents})
            else this.setState({drafts:[]})
        }).bind(this), ((resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        }))
    }

    saveDoc(document) {
        let action
        if (document.id == null || document.id.length == 0) {
            action = "add"
        } else {
            action = "edit"
        }
        
        HttpUtils.post("/api/member/document", {
            action: action,
            document: document,
        }, ((resp)=>{
            if (action == "add") this.setState({
                document: {
                    id: resp.id,
                    title: document.title,
                    content: document.content,
                    status: document.status,
                },
            })
            this.getDrafts(this.state.pageSize, this.state.pageIndex)
        }).bind(this), (resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        })
    }

    openDocument(id) {
        HttpUtils.get("/api/member/document/"+id,{},((resp)=>{
            console.log(resp)
            this.setState({
                document: {
                    id: resp.document.id,
                    title: resp.document.title,
                    content: resp.document.content,
                    status: resp.document.status,
                },
            })
            this.refs.editor.setValue(resp.document.content)
        }).bind(this),((resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        }))
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
                        {
                            this.state.drafts.map((document)=>{
                                return (
                                    <li className="docs-list-item" key={document.id}>
                                        <DocSideShortcut document={document} onSaveDoc={this.saveDoc.bind(this)} onClick={this.openDocument.bind(this)}></DocSideShortcut>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>

                <div className="col-md-9 col-xs-9 lowtea-doc-editor">
                    <div className="doc-title clearfix">
                        <div className="table-cell" style={{width:"99%"}}>
                            <input className="doc-title-input" placeholder="标题" value={this.state.document.title} onChange={
                                ((event)=>{
                                    this.setState({
                                        document:{
                                            title:event.target.value,
                                            id:this.state.document.id,
                                            content:this.state.document.content,
                                            status:this.state.document.status,
                                        },
                                    })
                                }
                            ).bind(this)}/>
                        </div>
                        <div className="table-cell" style={{width:"1%"}}>
                            <button type="button" className="btn btn-default" onClick={(()=>{this.saveDoc(this.state.document)}).bind(this)}><span className="glyphicon glyphicon-floppy-disk" style={{marginRight:"5px"}}></span>保存</button>
                        </div>
                    </div>

                    <MarkdownEditor ref="editor" onChange={((value)=>{
                        this.setState({
                            document: {
                                id: this.state.document.id,
                                title: this.state.document.title,
                                content: value,
                                status: this.state.document.status,
                            },
                        })
                    }).bind(this)}></MarkdownEditor>
                </div>
            </div>
        )
    }
}
