import React from 'react'

import SearchBar from '../searchbar/searchbar.jsx'
import DocsList from '../docs_list/docs_list.jsx'
import RecommendList from '../recommend_list/recommend_list.jsx'
import LiketopList from '../liketop_list/liketop_list.jsx'
import HttpUtils from '../../utils/http.jsx'

import './publicdocs_overview.less'

export default class PublicDocsOverView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            documents: [],
            pageSize: 10,
            pageIndex: 0,
            docTotal: 0,
        }

        HttpUtils.get('/api/member/self', {}, ((data) => {
            window.location.pathname = "/user.html"
        }).bind(this), ((data) => {
        }).bind(this))
        
        this.getDocuments(this.state.pageSize, this.state.pageIndex)
    }

    getDocuments(pageSize, pageIndex) {
        HttpUtils.get("/openapi/documents", {
            pageSize: pageSize,
            pageIndex: pageIndex,
        }, ((resp) => {
            this.setState({docTotal:resp.docTotal})
            if (resp.documents != null) this.setState({documents:resp.documents})
        }).bind(this), (resp) => {
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        })
    }

    render() {
        return <div className="lowtea-publicdoc-overview">
            <nav className="navbar navbar-inverse topbar" role="navigation">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">Brand</a>
                    </div>

                    <div className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="/login.html">Login In</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="clearfix">
                <div className="col-md-9 doc-list-container">
                    <div className="searchbar-container">
                        <SearchBar></SearchBar>
                    </div>
                    
                    <div className="clearfix" style={{margin:"0px 30px"}}>
                        <h4 className="doc-list-title">一共找到了{this.state.docTotal}篇文章</h4>

                        <DocsList RoutePrefix="/publicdoc_reader/" documents={this.state.documents}></DocsList>

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
                <div className="col-md-3" style={{margin:"10px 0px"}}>
                    <RecommendList></RecommendList>
                    <LiketopList title="最受喜欢的文章排行"></LiketopList>
                </div>
            </div>
        </div>
    }
}
