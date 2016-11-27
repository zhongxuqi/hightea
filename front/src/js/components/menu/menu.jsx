'use strict';

import React from 'react'
import {Link} from 'react-router'


import './menu.less';

export default class Menu extends React.Component {
    constructor() {
        super();
        this.state = {}
        this.state.menuState=window.location.hash.substring(2);
    }

    onMenuItemClick(newState) {
        console.log(newState)
        this.state.menuState = newState;
    }

    render() {
        return (
            <div className="lowtea-menu">
                <div className="lowtea-user-panel clearfix">
                    <div className="pull-left"><img className="lowtea-headimg" src="/img/heads/1.png"/></div>
                    <div className="pull-left lowtea-menu-userinfo">
                        <p className="lowtea-menu-username">用户名</p>
                        <p className="lowtea-menu-userintro"><span className="label label-info">管理员</span></p>
                    </div>

                    <button type="button" className="btn btn-success btn-sm pull-right lowtea-btn-new-page"><span className="glyphicon glyphicon-plus"></span>新建</button>
                </div>

                <ul className="lowtea-menu-list clearfix">
                    <li className={{true: 'active', false:''}[this.state.menuState == '']}>
                        <Link to="/" onClick={this.onMenuItemClick.bind(this, '')}><span className="glyphicon glyphicon-th-list"></span>所有文章</Link>
                    </li>

                    <li className={{true: 'active', false:''}[this.state.menuState == 'personalpages_list']}>
                        <Link to="/personalpages_list" onClick={this.onMenuItemClick.bind(this, 'personalpages_list')}><span className="glyphicon glyphicon-inbox"></span>我的文章</Link>
                    </li>

                    <li className={{true: 'active', false:''}[this.state.menuState == 'favoritepages_list']}>
                        <Link to="/favoritepages_list" onClick={this.onMenuItemClick.bind(this, 'favoritepages_list')}><span className="glyphicon glyphicon-star"></span>我喜欢的文章</Link>
                    </li>

                    <li className={{true: 'active', false:''}[this.state.menuState == 'personaldrafts_list']}>
                        <Link to="/personaldrafts_list" onClick={this.onMenuItemClick.bind(this, 'personaldrafts_list')}><span className="glyphicon glyphicon-file"></span>我的草稿</Link>
                    </li>

                    <li className={{true: 'active', false:''}[this.state.menuState == 'user_settings']}>
                        <Link to="/user_settings" onClick={this.onMenuItemClick.bind(this, 'user_settings')}><span className="glyphicon glyphicon-cog"></span>个人设置</Link>
                    </li>

                    <li className={{true: 'active', false:''}[this.state.menuState == 'users_manager']}>
                        <Link to="/users_manager" onClick={this.onMenuItemClick.bind(this, 'users_manager')}><span className="glyphicon glyphicon-user"></span>用户管理</Link>
                    </li>
                </ul>
            </div>
        );
    }
}