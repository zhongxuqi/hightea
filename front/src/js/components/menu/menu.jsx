'use strict';

import React from 'react'
import {Link} from 'react-router'

import UserBadge from '../user_badge/user_badge.jsx'
import HttpUtils from '../../utils/http.jsx'
import Language from '../../language/language.jsx'

import './menu.less';

export default class Menu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            menuState: window.location.hash.substring(2),
            password: {
                oldPassword: "",
                newPassword: "",
                reNewPassword: "",
                status: "",
            },
        }
    }

    onLogoutClick() {
        HttpUtils.get("/openapi/logout", {}, (data) => {
            window.location.pathname = "/login.html"
        }, (data) => {
            HttpUtil.alert("["+data.status+"]: "+data.responseText)
        })
    }

    onMenuItemClick(newState) {
        this.state.menuState = newState;
    }

    modalPassword() {
        this.setState({
            password: {
                oldPassword: "",
                newPassword: "",
                reNewPassword: "",
                status: "",
            }
        })
        $("#passwordModal").modal("show")
    }

    onChangePassword(key, event) {
        if (key == "oldPassword") {
            this.state.password.oldPassword = event.target.value
        } else if (key == "newPassword") {
            this.state.password.newPassword = event.target.value
        } else if (key == "reNewPassword") {
            this.state.password.reNewPassword = event.target.value
        }

        if (this.state.password.newPassword != this.state.password.reNewPassword) {
            this.state.password.status = "input-error"
        } else {
            this.state.password.status = ""
        }
        this.setState({})
    }

    onSavePassword() {
        if (this.state.password.status.length > 0) return
        $("#passwordModal").modal("hide")
        
        HttpUtils.post("/api/member/self_password", {
            password: this.state.password.oldPassword, 
            newPassword: this.state.password.newPassword,
        }, ((data) => {
            HttpUtils.notice("Success to save password!")
        }).bind(this), ((data) => {
            HttpUtils.alert("["+data.status+"] "+data.responseText)
        }).bind(this))
    }
    
    render() {
        return (
            <div className="lowtea-menu">
                <div className="lowtea-user-panel clearfix">
                    <div className="table-cell"><img className="lowtea-headimg" src={{false:this.props.userInfo.headimg,true:"/img/head.png"}[this.props.userInfo.headimg==""]}/></div>
                    <div className="table-cell lowtea-menu-userinfo">
                        <UserBadge nickname={this.props.userInfo.nickname} role={this.props.userInfo.role}></UserBadge>
                    </div>

                    <div className="table-cell dropdown">
                        <button className="btn btn-default btn-xs dropdown-toggle btn-dropdown-menu" type="button" data-toggle="dropdown">
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                            <li><a onClick={this.modalPassword.bind(this)}><i className="fa fa-lock" aria-hidden="true" style={{margin:"0px 10px 0px 0px"}}></i>修改密码</a></li>
                            <li><a onClick={this.onLogoutClick}><span className="glyphicon glyphicon-log-out" style={{margin:"0px 10px 0px 0px"}}></span>{Language.textMap("Quit")}</a></li>
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

                    <li className={{true: 'active', false:''}[this.state.menuState == 'stardocs_list']}>
                        <Link to="/stardocs_list" onClick={this.onMenuItemClick.bind(this, 'stardocs_list')}><span className="glyphicon glyphicon-star"></span>我喜欢的文章</Link>
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
                
                <div className="modal fade" id="passwordModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <h4 className="modal-title" id="myModalLabel">修改密码</h4>
                            </div>
                            <div className="modal-body">
                                <form className="form-horizontal lowtea-password-modal" role="form">
                                    <div className="form-group">
                                        <label className="col-sm-4 control-label">旧密码</label>
                                        <div className="col-sm-8">
                                            <input type="password" className="form-control" value={this.state.password.oldPassword} onChange={this.onChangePassword.bind(this, "oldPassword")}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-4 control-label">新密码</label>
                                        <div className="col-sm-8">
                                            <input type="password" className="form-control" value={this.state.password.newPassword} onChange={this.onChangePassword.bind(this, "newPassword")}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-4 control-label">重复新密码</label>
                                        <div className="col-sm-8">
                                            <input type="password" className={["form-control", this.state.password.status].join(" ")} value={this.state.password.reNewPassword} onChange={this.onChangePassword.bind(this, "reNewPassword")}/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                <button type="button" className="btn btn-primary" onClick={this.onSavePassword.bind(this)}>保存</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
