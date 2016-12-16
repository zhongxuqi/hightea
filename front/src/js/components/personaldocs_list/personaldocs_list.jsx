import React from 'react'

import SearchBar from '../searchbar/searchbar.jsx'
import DocsList from '../docs_list/docs_list.jsx'
import LiketopList from '../liketop_list/liketop_list.jsx'

import './personaldocs_list.less'

export default class PersonalDocsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            documents: [],
        }
    }
    render() {
        return (
            <div className="lowtea-personnaldocs-list">
                <div className="col-md-9 personnaldocs-list-container">
                    <div className="searchbar-container">
                        <SearchBar></SearchBar>
                    </div>

                    <div className="clearfix" style={{margin:"0px 30px"}}>
                        <h4 className="personnaldocs-list-title">一共找到了858篇文章</h4>

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

                <div className="col-md-3" style={{margin:"30px 0px"}}>
                    <LiketopList title="最受喜欢的个人文章排行"></LiketopList>
                </div>
            </div>
        )
    }
}
