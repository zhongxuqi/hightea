'use strict';

import React from 'react'

export default class Menu extends React.Component {
    render() {
        return (
            <div className={[this.props.class,"lowtea-menu"].join(" ")} style={{minHeight:$(window).height()+'px'}}>
                <div className="lowtea-user-panel clearfix">
                    <div className="pull-left"><img className="lowtea-headimg" src="/img/heads/1.png"/></div>
                    <div className="pull-left lowtea-menu-userinfo">
                        <p className="lowtea-menu-username">用户名</p>
                        <p className="lowtea-menu-userintro">个性签名</p>
                    </div>
                </div>

                <ul className="lowtea-menu-list">
                    <li className="active">
                        <a href="javascript:void(0)"><span className="glyphicon glyphicon-th-list"></span>所有文章</a>
                    </li>

                    <li>
                        <a href="javascript:void(0)"><span className="glyphicon glyphicon-inbox"></span>我的文章</a>
                    </li>

                    <li>
                        <a href="javascript:void(0)"><span className="glyphicon glyphicon-file"></span>草稿</a>
                    </li>
                </ul>
            </div>
        );
    }
}