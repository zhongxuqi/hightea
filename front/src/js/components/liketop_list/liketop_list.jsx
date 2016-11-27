import React from 'react';

import './liketop_list.less'

export default class LiketopList extends React.Component {
    render() {
        return (
            <div className="liketop-list">
                <h5>{this.props.title+":"}</h5>
                <div className="list-group">
                    <a href="" className="list-group-item">
                        文章标题
                        <span className="badge">100%</span>
                    </a>
                    <a href="" className="list-group-item">
                        文章标题
                        <span className="badge">98%</span>
                    </a>
                    <a href="" className="list-group-item">
                        文章标题
                        <span className="badge">96%</span>
                    </a>
                    <a href="" className="list-group-item">
                        文章标题
                        <span className="badge">94%</span>
                    </a>
                    <a href="" className="list-group-item">
                        文章标题
                        <span className="badge">92%</span>
                    </a>
                </div>
            </div>
        )
    }
}