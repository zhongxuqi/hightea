import React from 'react'

import SearchBar from '../searchbar/searchbar.jsx'
import DocsList from '../docs_list/docs_list.jsx'
import LiketopList from '../liketop_list/liketop_list.jsx'
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

    getStarDocuments(pageSize, pageIndex) {
        HttpUtils.get("/api/member/star_documents", {
            pageSize: pageSize,
            pageIndex: pageIndex,
        }, ((resp)=>{
            this.setState({
                documents: resp.documents,
                docTotal: resp.docTotal,
                pageTotal: resp.pageTotal,
            })
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

                <div className="clearfix" style={{margin:"0px 30px"}}>
                    <h4 className="stardocs-list-title">一共找到了{this.state.docTotal}篇文章</h4>

                    <DocsList documents={this.state.documents}></DocsList>

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
        )
    }
}
