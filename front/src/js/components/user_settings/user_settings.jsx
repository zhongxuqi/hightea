import React from 'react';

import HttpUtils from '../../utils/http.jsx'

import './user_settings.less'

export default class UserSettings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {
                nickname: this.props.nickname, 
                email: this.props.email, 
                userintro: this.props.role,
                gender: this.props.gender,
                language: this.props.language,
            },
            userinfoEdit: false,
            password: {
                oldPassword: "",
                newPassword: "",
                reNewPassword: "",
                status: "",
            },
        }
        this.state.copy = this.copyUser(this.state.user)
        this.updateUserInfo = this.props.updateUserInfo
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            user: {
                nickname: newProps.nickname, 
                email: newProps.email, 
                userintro: newProps.userintro, 
                gender: newProps.gender,
                language: newProps.language,
            },
            userinfoEdit: false,
        })
        this.setState({
            copy: this.copyUser({
                nickname: newProps.nickname, 
                email: newProps.email, 
                userintro: newProps.userintro, 
                gender: newProps.gender,
                language: newProps.language,
            }),
        })
    }

    onLanguageClick(event) {
        HttpUtils.post("/api/member/self", {
            nickname: this.state.user.nickname, 
            email: this.state.user.email, 
            userintro: this.state.user.userintro, 
            gender: this.state.user.gender,
            language: event.target.value,
        }, ((data) => {
            window.location = "/?lang="+data.language+"#/user_settings"
        }).bind(this), ((data) => {
            HttpUtils.alert("["+data.status+"] "+data.responseText)
        }).bind(this))
    }

    copyUser(user) {
        return {
            nickname: user.nickname,
            email: user.email,
            userintro: user.userintro,
            gender: user.gender,
            language: user.language,
        }
    }

    onChangeUserInfo(key, event) {
        if (key == "nickname") {
            this.state.copy.nickname = event.target.value
        } else if (key == "email") {
            this.state.copy.email = event.target.value
        } else if (key == "userintro") {
            this.state.copy.userintro = event.target.value
        } else if (key == "gender") {
            this.state.copy.gender = event.target.value
        }
        this.setState({})
    }

    onCancelUserInfoChange() {
        this.setState({
            userinfoEdit: false,
            copy: this.copyUser(this.state.user),
        })
    }

    onSaveUserInfoChange() {
        HttpUtils.post("/api/member/self", {
            nickname: this.state.copy.nickname, 
            email: this.state.copy.email, 
            userintro: this.state.copy.userintro, 
            gender: this.state.copy.gender,
            language: this.state.copy.language,
        }, ((data) => {
            this.updateUserInfo()
        }).bind(this), ((data) => {
            HttpUtils.alert("["+data.status+"] "+data.responseText)
        }).bind(this))
    }

    onClickPassword() {
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
            <div className="lowtea-user-settings clearfix">
                <div className="lowtea-group-title clearfix">
                    <h4 className="pull-left">用户信息</h4>

                    <button type="button" className="btn btn-primary btn-sm pull-right" style={{display:{true:"inline-block", false:"none"}[this.state.userinfoEdit]}} onClick={this.onSaveUserInfoChange.bind(this)}>保存</button>
                    <button type="button" className="btn btn-primary btn-sm pull-right" style={{display:{true:"inline-block", false:"none"}[this.state.userinfoEdit]}} onClick={this.onCancelUserInfoChange.bind(this)}>取消</button>
                    <button type="button" className="btn btn-primary btn-sm pull-right" style={{display:{false:"inline-block", true:"none"}[this.state.userinfoEdit]}} onClick={()=>{this.setState({userinfoEdit: true})}}>编辑</button>
                </div>

                <form className="form-horizontal lowtea-user-info" role="form">
                    <div className="form-group">
                        <label className="col-sm-2 control-label">昵称</label>
                        <div className="col-sm-10">
                            <input className="form-control" style={{display:{true:"block", false:"none"}[this.state.userinfoEdit]}} value={this.state.copy.nickname} onChange={this.onChangeUserInfo.bind(this, "nickname")}/>
                            <p className="show-text" style={{display:{false:"block", true:"none"}[this.state.userinfoEdit]}}>{this.state.user.nickname}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Email</label>
                        <div className="col-sm-10">
                            <input className="form-control" style={{display:{true:"block", false:"none"}[this.state.userinfoEdit]}} value={this.state.copy.email} onChange={this.onChangeUserInfo.bind(this, "email")}/>
                            <p className="show-text" style={{display:{false:"block", true:"none"}[this.state.userinfoEdit]}}>{this.state.user.email}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">密码</label>
                        <div className="col-sm-10">
                            <button type="button" className="btn btn-primary" onClick={this.onClickPassword.bind(this)}>修改密码</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">个人签名</label>
                        <div className="col-sm-10">
                            <input className="form-control" style={{display:{true:"block", false:"none"}[this.state.userinfoEdit]}} value={this.state.copy.userintro} onChange={this.onChangeUserInfo.bind(this, "userintro")}/>
                            <p className="show-text" style={{display:{false:"block", true:"none"}[this.state.userinfoEdit]}}>{this.state.user.userintro}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">性别</label>
                        <div className="col-sm-10" style={{height:"27px"}}>
                            <div className="radio" style={{padding:"0px", display:{true:"block", false:"none"}[this.state.userinfoEdit]}}>
                                <label className="radio-inline">
                                    <input type="radio" name="genderRadio" id="genderRadio" value="unknow" checked={this.state.copy.gender==""} onChange={this.onChangeUserInfo.bind(this, "gender")}/> 未知
                                </label>
                                <label className="radio-inline">
                                    <input type="radio" name="genderRadio" id="genderRadio" value="female" checked={this.state.copy.gender=="female"} onChange={this.onChangeUserInfo.bind(this, "gender")}/> 女
                                </label>
                                <label className="radio-inline">
                                    <input type="radio" name="genderRadio" id="genderRadio" value="male" checked={this.state.copy.gender=="male"} onChange={this.onChangeUserInfo.bind(this, "gender")}/> 男
                                </label>
                            </div>
                            <p className="show-text" style={{display:{false:"block", true:"none"}[this.state.userinfoEdit]}}>{{true:"女", false:{true:"男", false: "未知"}[this.state.copy.gender=="male"]}[this.state.copy.gender=="female"]}</p>
                        </div>
                    </div>
                </form>

                <div className="lowtea-group-title">
                    <h4>其它设置</h4>
                </div>

                <form className="form-horizontal lowtea-user-info" role="form">
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Language</label>
                        <div className="col-sm-10">
                            <select className="form-control" value={this.state.copy.language} onChange={this.onLanguageClick.bind(this)}>
                                <option value="">English</option>
                                <option value="cn">中文</option>
                            </select>
                        </div>
                    </div>
                </form>


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
        )
    }
}