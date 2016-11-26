import React from 'react'

export default class PagesOverView extends React.Component {
    render() {
        return <div className={[this.props.class, "lowtea-page-overview"].join(" ")}>
            <div className="col-md-9 page-list-container" style={{padding:"0px"}}>
                <div className="lowtea-searchbar clearfix">
                    <div className="col-xs-11"><input className="form-control" placeholder="请输入关键词"/></div>
                    <div className="col-xs-1"><button className="btn btn-default pull-right">搜索</button></div>
                </div>
                
                <div style={{margin:"0px 20px"}}>
                    <h4>一共找到了858篇文章</h4>

                    <ul className="page-list">

                    </ul>
                </div>
            </div>
            <div className="col-md-3">
            </div>
        </div>
    }
}