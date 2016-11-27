'use strict';

import React from 'react'
import {Link} from 'react-router'


import './menu.less';

export default class Menu extends React.Component {
    constructor() {
        super();
        this.state = {}
        this.state.menuState='pages_overview';
    }

    onMenuItemClick(newState) {
        this.state.menuState = newState;
    }

    render() {
        return (
            <div className="lowtea-menu">
                <div className="lowtea-user-panel clearfix">
                    <div className="pull-left"><img className="lowtea-headimg" src="/img/heads/1.png"/></div>
                    <div className="pull-left lowtea-menu-userinfo">
                        <p className="lowtea-menu-username">用户名</p>
                        <p className="lowtea-menu-userintro">个性签名</p>
                    </div>
                </div>

                <ul className="lowtea-menu-list clearfix">
                    <li className={{true: 'active', false:''}[this.state.menuState == 'pages_overview']}>
                        <Link to="/" onClick={this.onMenuItemClick.bind(this, 'pages_overview')}><span className="glyphicon glyphicon-th-list"></span>所有文章</Link>
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
                </ul>
            </div>
        );
    }
}