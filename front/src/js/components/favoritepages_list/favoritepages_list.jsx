import React from 'react'

import SearchBar from '../searchbar/searchbar.jsx'
import PagesList from '../pages_list/pages_list.jsx'
import LiketopList from '../liketop_list/liketop_list.jsx'

import './favoritepages_list.less'

export default class FavoritePagesList extends React.Component {
    render() {
        return (
            <div className="lowtea-favoritepages-list">
                <div className="searchbar-container">
                    <SearchBar></SearchBar>
                </div>

                <div className="clearfix" style={{margin:"0px 30px"}}>
                    <h4 className="favoritepages-list-title">一共找到了858篇文章</h4>

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
        )
    }
}