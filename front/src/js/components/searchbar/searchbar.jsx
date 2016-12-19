import React from 'react'

export default class SearchBar extends React.Component {
    render() {
        return (
            <div className="lowtea-searchbar clearfix lowtea-table" style={{width:"100%"}}>
                <div className="lowtea-table-cell" style={{width:"99%", paddingRight:"10px"}}>
                    <input className="form-control" placeholder="请输入关键词"/>
                </div>
                <div className="lowtea-table-cell" style={{width:"1%"}}>
                    <button className="btn btn-default">搜索</button>
                </div>
            </div>
        )
    }
}
