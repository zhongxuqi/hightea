import React from 'react'

export default class PagesOverView extends React.Component {
    render() {
        return <div className={[this.props.class, "lowtea-page-overview"].join(" ")}>
            <div className="navigation clearfix">
                <ul className="pull-left">
                    <li className="item active">
                        <a href="">推荐排序</a>
                    </li>

                    <li className="item">
                        <a href="">时间排序</a>
                    </li>
                </ul>
                <div className="form-group pull-right lowtea-searchbar">
                    <div className="input-group">
                        <div className="input-group-addon"><span className="glyphicon glyphicon-search"></span></div>
                        <input className="form-control" placeholder="请输入关键词"/>
                    </div>
                </div>
            </div>
        </div>
    }
}