import React from 'react'

import SearchBar from '../searchbar/searchbar.jsx'
import DocsList from '../docs_list/docs_list.jsx'
import LiketopList from '../liketop_list/liketop_list.jsx'
import LoadingBtn from '../loading_btn/loading_btn.jsx'

import HttpUtils from '../../utils/http.jsx'

import './personaldocs_list.less'

export default class PersonalDocsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            documents: [],
            pageSize: 10,
            pageIndex: 0,
            docTotal: 0,
            
            confirmModal: {
                title: "",
                message: "",
            },
        }
        this.getDocuments(this.state.pageSize, this.state.pageIndex)
    }
    
    getDocuments(pageSize, pageIndex, successFunc, errorFunc) {
        HttpUtils.get("/api/member/documents", {
            pageSize: pageSize,
            pageIndex: pageIndex,
        }, ((resp) => {
            if (resp.documents == null) resp.documents = []
            if (pageIndex == 0) {
                this.setState({
                    documents: resp.documents,
                    docTotal: resp.docTotal,
                })
            } else {
                this.setState({
                    documents: this.state.documents.concat(resp.documents),
                    docTotal: resp.docTotal,
                })
            }
            
            if (successFunc != undefined) successFunc(pageIndex + 1 >= resp.pageTotal)
        }).bind(this), (resp) => {
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
            if (errorFunc != undefined) errorFunc()
        })
    
    }

    onSaveDoc(document) {
        console.log(document)
        HttpUtils.post("/api/member/document", {
            action: "edit",
            document: document,
        }, ((resp)=>{
            let documents = this.state.documents
            for (let i=0;i<documents.length;i++) {
                if (documents[i].id == document.id) {
                    documents[i].status = document.status
                    this.setState({documents:documents})
                    break;
                }
            }
        }).bind(this), (resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        })
    }

    onDeleteDoc(id) {
        console.log(id)
        this.props.onConfirm("Danger", "delete the doc?", (()=>{
            $("#confirmModal #confirmAffirmBtn").on("click", () => {
                HttpUtils.delete("/api/member/document/"+id, {}, ((data) => {
                    this.getDocuments(this.state.pageSize, this.state.pageIndex)
                }).bind(this), ((data) => {
                    HttpUtils.alert("["+data.status+"] "+data.responseText)
                }))
            })
        }).bind(this))
    }

    render() {
        return (
            <div className="lowtea-personnaldocs-list">
                <div className="col-md-9 personnaldocs-list-container">
                    <div className="searchbar-container">
                        <SearchBar></SearchBar>
                    </div>

                    <div className="clearfix" style={{margin:"0px 30px", paddingBottom:"10px"}}>
                        <h4 className="personnaldocs-list-title">一共找到了{this.state.docTotal}篇文章</h4>

                        <DocsList documents={this.state.documents} onSaveDoc={this.onSaveDoc.bind(this)} onDeleteDoc={this.onDeleteDoc.bind(this)}></DocsList>

                        <div style={{width:"100%"}}>
                            <LoadingBtn ref="LoadingBtn" onClick={(()=>{
                                this.getDocuments(this.state.pageSize, this.state.pageIndex + 1, ((isEnd)=>{
                                    if (isEnd) {
                                        this.refs.LoadingBtn.button("finish")
                                    } else {
                                        this.refs.LoadingBtn.button("active")
                                    }
                                    this.setState({pageIndex: this.state.pageIndex+1})
                                }).bind(this), ()=>{
                                    this.refs.LoadingBtn.button("active")
                                }) 
                            }).bind(this)}></LoadingBtn>
                        </div>
                    </div>
                </div>

                <div className="col-md-3" style={{margin:"30px 0px"}}>
                    <LiketopList title="最受喜欢的个人文章排行"></LiketopList>
                </div>
            </div>
        )
    }
}
