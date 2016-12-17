import React from 'react'

import SearchBar from '../searchbar/searchbar.jsx'
import DocsList from '../docs_list/docs_list.jsx'
import LiketopList from '../liketop_list/liketop_list.jsx'
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
    
    getDocuments(pageSize, pageIndex) {
        HttpUtils.get("/api/member/documents", {
            pageSize: pageSize,
            pageIndex: pageIndex,
        }, ((resp) => {
            this.setState({docTotal:resp.docTotal})
            if (resp.documents == null) resp.documents = []
            this.setState({documents:resp.documents})
        }).bind(this), (resp) => {
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
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
        $("#confirmModal").on("show.bs.modal", () => {
            $("#confirmModal #confirmAffirmBtn").on("click", () => {
                HttpUtils.delete("/api/member/document/"+id, {}, ((data) => {
                    this.getDocuments(this.state.pageSize, this.state.pageIndex)
                }).bind(this), ((data) => {
                    HttpUtils.alert("["+data.status+"] "+data.responseText)
                }))
                $("#confirmModal #confirmAffirmBtn").off("click")
                $("#confirmModal").modal("hide")
            })
        })
        $("#confirmModal").on("hide", () => {
            $("#confirmModal #confirmAffirmBtn").off("click")
        })
        $("#confirmModal").modal("show")
        this.setState({
            confirmModal: {
                title: "Danger",
                message: "delete the doc ?",
            }
        })
    }

    render() {
        return (
            <div className="lowtea-personnaldocs-list">
                <div className="col-md-9 personnaldocs-list-container">
                    <div className="searchbar-container">
                        <SearchBar></SearchBar>
                    </div>

                    <div className="clearfix" style={{margin:"0px 30px"}}>
                        <h4 className="personnaldocs-list-title">一共找到了{this.state.docTotal}篇文章</h4>

                        <DocsList documents={this.state.documents} onSaveDoc={this.onSaveDoc.bind(this)} onDeleteDoc={this.onDeleteDoc.bind(this)}></DocsList>

                        <nav className="pull-right">
                            <ul className="pagination">
                                <li><a href="#">&laquo;</a></li>
                                <li><a href="#">1</a></li>
                                <li><a href="#">2</a></li>
                                <li><a href="#">3</a></li>
                                <li><a href="#">4</a></li>
                                <li><a href="#">5</a></li>
                                <li><a href="#">&raquo;</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="col-md-3" style={{margin:"30px 0px"}}>
                    <LiketopList title="最受喜欢的个人文章排行"></LiketopList>
                </div>
                
                <div id="confirmModal" className="modal fade bs-example-modal-sm" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <h4 className="modal-title">{this.state.confirmModal.title}</h4>
                            </div>
                            <div className="modal-body">
                                <p>{this.state.confirmModal.message}</p>
                            </div>
                            <div className="modal-footer">
                                <button id="confirmCancelBtn" type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                <button id="confirmAffirmBtn" type="button" className="btn btn-primary">确定</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
