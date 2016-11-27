import React from 'react'

import './recommend_list.less';

export default class RecommendList extends React.Component {
    render() {
        return (
            <div className="recommend-list">
                <h5>置顶文章:</h5>
                <div className="list-group">
                    <a href="" className="list-group-item">文章标题</a>
                    <a href="" className="list-group-item">文章标题</a>
                    <a href="" className="list-group-item">文章标题</a>
                    <a href="" className="list-group-item">文章标题</a>
                    <a href="" className="list-group-item">文章标题</a>
                </div>
            </div>
        )
    }
}