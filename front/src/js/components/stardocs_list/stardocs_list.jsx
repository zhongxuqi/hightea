import React from 'react'

import SearchBar from '../searchbar/searchbar.jsx'
import DocsList from '../docs_list/docs_list.jsx'
import LiketopList from '../liketop_list/liketop_list.jsx'
import LoadingBtn from '../loading_btn/loading_btn.jsx'

import HttpUtils from '../../utils/http.jsx'

import './stardocs_list.less'

export default class StarDocsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            documents: [],
            pageSize: 10,
            pageIndex: 0,
            docTotal: 0,
            pageTotal: 0,
        }
        this.getStarDocuments(this.state.pageSize, this.state.pageIndex)
    }

    getStarDocuments(pageSize, pageIndex, successFunc, errorFunc) {
        HttpUtils.get("/api/member/star_documents", {
            pageSize: pageSize,
            pageIndex: pageIndex,
        }, ((resp)=>{
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
        }).bind(this), (resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        })
    }

    render() {
        return (
            <div className="lowtea-stardocs-list">
                <div className="searchbar-container">
                    <SearchBar></SearchBar>
                </div>

                <div className="clearfix" style={{margin:"0px 30px", paddingBottom:"10px"}}>
                    <h4 className="stardocs-list-title">一共找到了{this.state.docTotal}篇文章</h4>

                    <DocsList documents={this.state.documents}></DocsList>

                    <div style={{width:"100%"}}>
                        <LoadingBtn ref="LoadingBtn" onClick={(()=>{
                            this.getStarDocuments(this.state.pageSize, this.state.pageIndex + 1, ((isEnd)=>{
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
        )
    }
}
