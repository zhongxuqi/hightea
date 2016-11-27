import React from 'react'

import SearchBar from '../searchbar/searchbar.jsx'
import PagesList from '../pages_list/pages_list.jsx'
import RecommendList from '../recommend_list/recommend_list.jsx'
import LiketopList from '../liketop_list/liketop_list.jsx'

import './pages_overview.less'

export default class PagesOverView extends React.Component {
    render() {
        return <div className="lowtea-page-overview">
            <div className="col-md-9 page-list-container">
                <div className="searchbar-container">
                    <SearchBar></SearchBar>
                </div>
                
                <div className="clearfix" style={{margin:"0px 30px"}}>
                    <h4 className="page-list-title">一共找到了858篇文章</h4>

                    <PagesList></PagesList>

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
                <RecommendList></RecommendList>
                <LiketopList title="最受喜欢的文章排行"></LiketopList>
            </div>
        </div>
    }
}