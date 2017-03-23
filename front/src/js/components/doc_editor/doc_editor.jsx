import React from 'react';

import DocSideShortcut from '../doc_side_shortcut/doc_side_shortcut.jsx'
import MarkdownEditor from '../markdown_editor/markdown_editor.jsx'
import LoadingBtn from '../loading_btn/loading_btn.jsx'

import HttpUtils from '../../utils/http.jsx'
import Language from '../../language/language.jsx'

import './doc_editor.less'

export default class DocEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pageSize: 10,
            pageIndex: 0,
            keyword: "",
            drafts: [],
            document: {
                title: "",
                content: "",
                status: "status_draft",
            },
            ischanged: false,
        }

        this.getDrafts(this.state.pageSize, this.state.pageIndex)
    }

    componentDidMount() {
        this.refs.editor.setValue(this.state.document.content)
        if ("id" in this.props.routeParams) this.openDocumentById(this.props.routeParams.id)
    }

    getDrafts(pageSize, pageIndex) {
        HttpUtils.get("/api/member/drafts", {
            pageSize: pageSize,
            pageIndex: pageIndex,
            keyword: this.state.keyword,
        }, ((resp)=>{
            if (resp.documents == null) resp.documents = []
            if (pageIndex == 0) {
                this.setState({
                    drafts:resp.documents,
                    pageTotal: resp.pageTotal,
                })
            } else {
                this.setState({
                    drafts:this.state.drafts.concat(resp.documents),
                    pageTotal: resp.pageTotal,
                })
            }
            
            if (pageIndex + 1 >= resp.pageTotal) {
                this.refs.LoadingBtn.button("finish")
            } else {
                this.refs.LoadingBtn.button("active")
            }
            this.setState({pageIndex: pageIndex})
        }).bind(this), ((resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
            this.refs.LoadingBtn.button("active")
        }))
    }

    publishDoc(document) {
        if (document.id == this.state.document.id && this.state.ischanged==true) {
            this.props.onConfirm(Language.textMap("Warning"),Language.textMap("Whether to ")+Language.textMap("save")+" "+Language.textMap("the document")+" ?",(()=>{
                let metadoc = this.state.document
                metadoc.status = document.status
                this.saveDoc(metadoc, (()=>{
                    this.refs.editor.setValue("")
                    this.state.ischanged = false
                    this.state.document = {
                        title:"",
                        content:"",
                        status:"status_draft",
                    }
                    this.setState({})
                }).bind(this))
            }).bind(this))
        } else {
            HttpUtils.post("/api/member/document_status", {
                document: document,
            }, ((resp)=>{
                this.getDrafts(this.state.pageSize, 0)
            }).bind(this), (resp)=>{
                HttpUtils.alert("["+resp.status+"] "+resp.responseText)
            })
        }
    }

    saveDoc(document, callback) {
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
            this.state.ischanged = false
            if (action == "add") {
                this.setState({
                    document: {
                        id: resp.id,
                        title: document.title,
                        content: document.content,
                        status: document.status,
                    },
                })
            }
            if (callback != undefined) callback()
            this.getDrafts(this.state.pageSize, 0)
        }).bind(this), (resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        })
    }
    
    onDeleteDoc(id) {
        this.props.onConfirm(Language.textMap("Danger"), Language.textMap("Whether to ")+Language.textMap("delete")+" "+Language.textMap("the document")+" ?", (()=>{
            HttpUtils.delete("/api/member/document/"+id, {}, ((data) => {
                this.getDrafts(this.state.pageSize, 0)
            }).bind(this), ((data) => {
                HttpUtils.alert("["+data.status+"] "+data.responseText)
            }))
        }).bind(this))
    }

    newDocument() {
        if (this.state.ischanged) {
            this.props.onConfirm(Language.textMap("Alert"), Language.textMap("Whether to ")+Language.textMap("save")+" "+Language.textMap("the document")+" ?", (()=>{
                if (this.state.document.title.length == 0) {
                    HttpUtils.alert("title is empty")
                    return
                }
                this.refs.editor.setValue("")
                this.saveDoc(this.state.document, (()=>{
                    this.setState({
                        document: {
                            title: "",
                            content: "",
                            status: "status_draft",
                        },
                        ischanged: false,
                    })
                }).bind(this))
            }).bind(this), (()=>{
                this.refs.editor.setValue("")
                this.setState({
                    document: {
                        title: "",
                        content: "",
                        status: "status_draft",
                    },
                    ischanged: false,
                })
            }).bind(this))
        } else {
            this.refs.editor.setValue("")
            this.setState({
                document: {
                    title: "",
                    content: "",
                    status: "status_draft",
                },
                ischanged: false,
            })
        }
    }

    openDocument(document) {
        if (this.state.ischanged) {
            this.props.onConfirm(Language.textMap("Alert"), Language.textMap("Whether to ")+Language.textMap("save")+" "+Language.textMap("the document")+" ?", (()=>{
                this.saveDoc(this.state.document, (()=>{
                    this.refs.editor.setValue(document.content)
                    this.setState({
                        document: {
                            id: document.id,
                            title: document.title,
                            content: document.content,
                            status: document.status,
                        },
                        ischanged: false,
                    })
                }).bind(this))
            }).bind(this), (()=>{
                this.refs.editor.setValue(document.content)
                this.setState({
                    document: {
                        id: document.id,
                        title: document.title,
                        content: document.content,
                        status: document.status,
                    },
                    ischanged: false,
                })
            }).bind(this))
        } else {
            this.refs.editor.setValue(document.content)
            this.state.document = {
                id: document.id,
                title: document.title,
                content: document.content,
                status: document.status,
            }
            this.state.ischanged = false
            this.setState({})
        }
    }

    openDocumentById(id) {
        HttpUtils.get("/api/member/document/"+id,{},((resp)=>{
            this.setState({
                document:resp.document,
            })
            this.refs.editor.setValue(resp.document.content)
        }).bind(this),(resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        })
    }

    render() {
        return (
            <div className="clearfix" style={{height:"100%"}}>
                <div className="col-md-3 col-xs-3 lowtea-docs-sidebar">
                    <h4>{Language.textMap("Drafts Box")}</h4>
                    <div className="side-searchbar">
                        <input id="input-keyword" className="form-control" placeholder={Language.textMap("Please input keyword")}/>
                        <button className="btn btn-default" onClick={(()=>{
                            this.state.keyword = document.getElementById("input-keyword").value
                            this.state.pageIndex = 0
                            this.getDrafts(this.state.pageSize, this.state.pageIndex)
                            this.setState({})
                        }).bind(this)}><span className="glyphicon glyphicon-search"></span></button>
                    </div>
                    <ul className="docs-list">
                        <li className="docs-list-item btn-new-doc" onClick={this.newDocument.bind(this)}>
                            <a><span className="glyphicon glyphicon-plus"></span>{Language.textMap("Add new document")}</a>
                        </li>
                        {
                            this.state.drafts.map(((document)=>{
                                return (
                                    <li className="docs-list-item" key={document.id}>
                                        <DocSideShortcut document={document} onPublishDoc={this.publishDoc.bind(this)} onClick={this.openDocument.bind(this)} onDeleteDoc={this.onDeleteDoc.bind(this)}></DocSideShortcut>
                                    </li>
                                )
                            }).bind(this))
                        }
                    </ul>
                    <div style={{width:"100%"}}>
                        <LoadingBtn ref="LoadingBtn" onClick={(()=>{
                            this.getDrafts(this.state.pageSize, this.state.pageIndex + 1) 
                        }).bind(this)}></LoadingBtn>
                    </div>
                </div>

                <div className="col-md-9 col-xs-9 lowtea-doc-editor">
                    <div className="doc-title clearfix">
                        <div className="table-cell" style={{width:"99%"}}>
                            <input className="doc-title-input" placeholder={Language.textMap("Title")} value={this.state.document.title} onChange={
                                ((event)=>{
                                    this.setState({
                                        document:{
                                            title:event.target.value,
                                            id:this.state.document.id,
                                            content:this.state.document.content,
                                            status:this.state.document.status,
                                        },
                                        ischanged: true,
                                    })
                                }
                            ).bind(this)}/>
                        </div>
                        <div className="table-cell" style={{width:"1%"}}>
                            <button type="button" className="btn btn-default" disabled={{false:"disabled", true:""}[this.state.ischanged]} onClick={(()=>{this.saveDoc(this.state.document)}).bind(this)}><span className="glyphicon glyphicon-floppy-disk" style={{marginRight:"5px"}}></span>{Language.textMap("Save")}</button>
                        </div>
                    </div>

                    <MarkdownEditor ref="editor" onChange={((value)=>{
                        this.state.document.content = value
                        this.state.ischanged = true
                        this.setState({})
                    }).bind(this)}></MarkdownEditor>
                </div>
            </div>
        )
    }
}
