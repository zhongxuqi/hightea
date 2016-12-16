'use strict';

import React from 'react'
import {Link} from 'react-router'

import UserBadge from '../user_badge/user_badge.jsx'
import HttpUtil from '../../utils/http.jsx'
import Language from '../../language/language.jsx'

import './menu.less';

export default class Menu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {nickname: this.props.nickname, role: this.props.role}
        this.state.menuState=window.location.hash.substring(2);
    }

    onLogoutClick() {
        HttpUtil.get("/openapi/logout", {}, (data) => {
            window.location.pathname = "/login.html"
        }, (data) => {
            HttpUtil.alert("["+data.status+"]: "+data.responseText)
        })
    }

    onMenuItemClick(newState) {
        this.state.menuState = newState;
    }

    componentWillReceiveProps(newProps) {
        this.setState({nickname: newProps.nickname, role: newProps.role})
    }

    render() {
        return (
            <div className="lowtea-menu">
                <div className="lowtea-user-panel clearfix">
                    <div className="table-cell"><img className="lowtea-headimg" src="/img/heads/1.png"/></div>
                    <div className="table-cell lowtea-menu-userinfo">
                        <UserBadge nickname={this.state.nickname} role={this.state.role}></UserBadge>
                    </div>

                    <div className="table-cell dropdown">
                        <button className="btn btn-default btn-xs dropdown-toggle btn-dropdown-menu" type="button" data-toggle="dropdown">
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                            <li><a href="" onClick={this.onLogoutClick}><span className="glyphicon glyphicon-log-out" style={{margin:"0px 10px 0px 0px"}}></span>{Language.textMap("Quit")}</a></li>
                        </ul>
                    </div>
                </div>

                <ul className="lowtea-menu-list clearfix">
                    <li className={{true: 'active', false:''}[this.state.menuState == '']}>
                        <Link to="/" onClick={this.onMenuItemClick.bind(this, '')}><span className="glyphicon glyphicon-th-list"></span>所有文章</Link>
                    </li>

                    <li className={{true: 'active', false:''}[this.state.menuState == 'doc_editor']}>
                        <Link to="/doc_editor" onClick={this.onMenuItemClick.bind(this, 'doc_editor')}><span className="glyphicon glyphicon-pencil"></span>编辑文章</Link>
                    </li>

                    <li className={{true: 'active', false:''}[this.state.menuState == 'favoritedocs_list']}>
                        <Link to="/favoritedocs_list" onClick={this.onMenuItemClick.bind(this, 'favoritedocs_list')}><span className="glyphicon glyphicon-star"></span>我喜欢的文章</Link>
                    </li>

                    <li className={{true: 'active', false:''}[this.state.menuState == 'personaldocs_list']}>
                        <Link to="/personaldocs_list" onClick={this.onMenuItemClick.bind(this, 'personaldocs_list')}><span className="glyphicon glyphicon-file"></span>我的文章</Link>
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
