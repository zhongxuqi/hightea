import React from 'react';

import HttpUtils from '../../utils/http.jsx'

import './user_settings.less'

export default class UserSettings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {
                nickname: this.props.nickname, 
                userintro: this.props.role,
                gender: this.props.gender,
            },
            userinfoEdit: false,
            language: this.props.language,
        }
        this.state.copy = this.copyUser(this.state.user)
        this.updateUserInfo = this.props.updateUserInfo
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            user: {
                nickname: newProps.nickname, 
                userintro: newProps.userintro, 
                gender: newProps.gender,
            },
            language: newProps.language,
        })
        this.setState({
            copy: this.copyUser({
                nickname: newProps.nickname, 
                userintro: newProps.userintro, 
                gender: newProps.gender,
            }),
        })
    }

    onLanguageClick(event) {
        HttpUtils.post("/api/member/self", {
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
            userintro: user.userintro,
            gender: user.gender,
        }
    }

    onGenderClick(event) {
        let copyUser = this.state.copy
        copyUser.gender = event.target.value
        this.setState({
            copy: copyUser,
        })
    }

    render() {
        return (
            <div className="lowtea-user-settings clearfix">
                <div className="lowtea-group-title clearfix">
                    <h4 className="pull-left">用户信息</h4>

                    <button type="button" className="btn btn-primary btn-sm pull-right" style={{display:{true:"inline-block", false:"none"}[this.state.userinfoEdit]}} onClick={()=>{this.setState({userinfoEdit: false})}}>保存</button>
                    <button type="button" className="btn btn-primary btn-sm pull-right" style={{display:{true:"inline-block", false:"none"}[this.state.userinfoEdit]}} onClick={()=>{this.setState({userinfoEdit: false})}}>取消</button>
                    <button type="button" className="btn btn-primary btn-sm pull-right" style={{display:{false:"inline-block", true:"none"}[this.state.userinfoEdit]}} onClick={()=>{this.setState({userinfoEdit: true})}}>编辑</button>
                </div>

                <form className="form-horizontal lowtea-user-info" role="form">
                    <div className="form-group">
                        <label className="col-sm-2 control-label">昵称</label>
                        <div className="col-sm-10">
                            <input className="form-control" style={{display:{true:"block", false:"none"}[this.state.userinfoEdit]}} value={this.state.user.nickname}/>
                            <p className="show-text" style={{display:{false:"block", true:"none"}[this.state.userinfoEdit]}}>{this.state.copy.nickname}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">密码</label>
                        <div className="col-sm-10">
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#passwordModal">修改密码</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">个人签名</label>
                        <div className="col-sm-10">
                            <input className="form-control" style={{display:{true:"block", false:"none"}[this.state.userinfoEdit]}} value={this.state.user.userintro}/>
                            <p className="show-text" style={{display:{false:"block", true:"none"}[this.state.userinfoEdit]}}>{this.state.copy.userintro}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">性别</label>
                        <div className="col-sm-10" style={{height:"27px"}}>
                            <div className="radio" style={{padding:"0px", display:{true:"block", false:"none"}[this.state.userinfoEdit]}}>
                                <label className="radio-inline">
                                    <input type="radio" name="genderRadio" id="genderRadio" value="unknow" checked={this.state.copy.gender==""} onChange={this.onGenderClick.bind(this)}/> 未知
                                </label>
                                <label className="radio-inline">
                                    <input type="radio" name="genderRadio" id="genderRadio" value="female" checked={this.state.copy.gender=="female"} onChange={this.onGenderClick.bind(this)}/> 女
                                </label>
                                <label className="radio-inline">
                                    <input type="radio" name="genderRadio" id="genderRadio" value="male" checked={this.state.copy.gender=="male"} onChange={this.onGenderClick.bind(this)}/> 男
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
                            <select className="form-control" value={this.state.language} onChange={this.onLanguageClick.bind(this)}>
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
                                        <input type="password" className="form-control"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-4 control-label">新密码</label>
                                    <div className="col-sm-8">
                                        <input type="password" className="form-control"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-4 control-label">重复新密码</label>
                                    <div className="col-sm-8">
                                        <input type="password" className="form-control"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}