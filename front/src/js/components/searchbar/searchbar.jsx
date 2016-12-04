import React from 'react'

export default class SearchBar extends React.Component {
    render() {
        return (
            <div className="lowtea-searchbar clearfix">
                <div className="col-md-11"><input className="form-control" placeholder="请输入关键词"/></div>
                <div className="col-md-1"><button className="btn btn-default pull-right">搜索</button></div>
            </div>
        )
    }
}