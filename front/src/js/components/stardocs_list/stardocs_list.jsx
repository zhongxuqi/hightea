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
            keyword: "",
            docTotal: 0,
        }
        
        HttpUtils.get("/api/member/star_documents", {
            keyword: this.state.keyword,
        }, ((resp)=>{
            this.setState({
                resp:resp,
                documents: resp.documents,
                docTotal: resp.docTotal,
            })
        }).bind(this), (resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        })
    }

    getStarDocuments(keyword) {
        let documents = []
        for (let i=0;i<this.state.resp.documents.length;i++) {
            if (new RegExp(keyword).test(this.state.resp.documents[i].title)) {
                documents.push(this.state.resp.documents[i])
            }
        }
        this.setState({
            documents: documents,
            docTotal: documents.length,
        })
    }

    render() {
        return (
            <div className="lowtea-stardocs-list">
                <div className="searchbar-container">
                    <SearchBar ref="searchbar" onClick={(()=>{
                        this.state.keyword = this.refs.searchbar.getValue()
                        this.getStarDocuments(this.state.keyword)
                        this.setState({})
                    }).bind(this)}></SearchBar>
                </div>

                <div className="clearfix" style={{margin:"0px 30px", paddingBottom:"10px"}}>
                    <h4 className="stardocs-list-title">一共找到了{this.state.docTotal}篇文章</h4>

                    <DocsList documents={this.state.documents}></DocsList>
                </div>
            </div>
        )
    }
}
