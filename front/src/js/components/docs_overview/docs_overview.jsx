import React from 'react'

import SearchBar from '../searchbar/searchbar.jsx'
import DocsList from '../docs_list/docs_list.jsx'
import RecommendList from '../recommend_list/recommend_list.jsx'
import LiketopList from '../liketop_list/liketop_list.jsx'
import LoadingBtn from '../loading_btn/loading_btn.jsx'

import HttpUtils from '../../utils/http.jsx'

import './docs_overview.less'

export default class DocsOverView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            documents: [],
            pageSize: 10,
            pageIndex: 0,
            docTotal: 0,
            keyword: "",
        }
        this.getDocuments(this.state.pageSize, this.state.pageIndex)
    }

    getDocuments(pageSize, pageIndex, successFunc, errorFunc) {
        HttpUtils.get("/api/member/documents", {
            pageSize: pageSize,
            pageIndex: pageIndex,
            keyword: this.state.keyword,
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
            
            if (pageIndex + 1 >= resp.pageTotal) {
                this.refs.LoadingBtn.button("finish")
            } else {
                this.refs.LoadingBtn.button("active")
            }
            this.setState({pageIndex: pageIndex})
        }).bind(this), (resp) => {
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
            this.refs.LoadingBtn.button("active")
        })
    }

    render() {
        return <div className="lowtea-doc-overview">
            <div className="col-md-9 doc-list-container">
                <div className="searchbar-container">
                    <SearchBar ref="searchbar" onClick={(()=>{
                        this.state.keyword = this.refs.searchbar.getValue()
                        this.state.pageIndex = 0
                        this.getDocuments(this.state.pageSize, 0)
                        this.setState({})
                    }).bind(this)}></SearchBar>
                </div>
                
                <div className="clearfix" style={{margin:"0px 30px", paddingBottom:"10px"}}>
                    <h4 className="doc-list-title">一共找到了{this.state.docTotal}篇文章</h4>

                    <DocsList documents={this.state.documents}></DocsList>

                    <div style={{width:"100%"}}>
                        <LoadingBtn ref="LoadingBtn" onClick={(()=>{
                            this.getDocuments(this.state.pageSize, this.state.pageIndex + 1) 
                        }).bind(this)}></LoadingBtn>
                    </div>
                </div>
            </div>
            <div className="col-md-3" style={{margin:"30px 0px"}}>
                <RecommendList></RecommendList>
                <LiketopList title="最受喜欢的文章排行"></LiketopList>
            </div>
        </div>
    }
}
