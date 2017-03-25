import React from 'react';
import md5 from 'js-md5'

import HttpUtils from '../../utils/http.jsx'
import Language from '../../language/language.jsx'

import './users_manager.less'

export default class UsersManager extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            registers: [],
            confirmModal: {},
            userInfo: props.userInfo,
            rootEmail: "",
            password: {
                newPassword: '',
                reNewPassword: '',
                hasError: false,
            },
        }
        this.updateUsersList()
        if (this.props.userInfo.role == "root" || this.props.userInfo.role == "admin") {
            this.updateRegistersList()
        }
        
        HttpUtils.get("/openapi/rootinfo",{},((resp)=>{
            this.setState({rootEmail:resp.rootEmail})
        }).bind(this), (resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        })
    }

    copyUser(user) {
        return {
            role: user.role,
        }
    }

    cancelUserEdit(user) {
        user.isEdit = false
        user.copy = this.copyUser(user)
        this.setState({})
    }

    showUserEdit(user) {
        user.isEdit = true
        this.setState({})
    }

    saveUserEdit(userObj) {
        this.props.onConfirm(Language.textMap("Warning"),
                Language.textMap("Whether to ")+Language.textMap("save")+" "+userObj.account+" ?", (()=>{
            HttpUtils.post("/api/admin/user/"+userObj.account, {
                role: userObj.copy.role,
            }, ((data) => {
                this.updateUsersList()
            }).bind(this), ((data) => {
                HttpUtils.alert("["+data.status+"] "+data.responseText)
            }))
        }).bind(this))
    }

    updateUsersList() {
        HttpUtils.get("/api/member/users", {}, ((data) => {
            if (data['users'] == undefined) data['users'] = []
            let users = data['users']
            for (let i=0;i<users.length;i++) {
                users[i].isEdit = false
                users[i].copy = this.copyUser(users[i])
            }
            this.setState({users: users})
        }).bind(this), ((data) => {
            HttpUtils.alert("["+data.status+"] "+data.responseText)
        }))
    }

    updateRegistersList() {
        HttpUtils.get("/api/admin/registers", {}, ((data) => {
            if (data['registers'] == undefined) data['registers'] = []
            this.setState({registers: data['registers']})
        }).bind(this), ((data) => {
            HttpUtils.alert("["+data.status+"] "+data.responseText)
        }))
    }

    componentWillReceiveProps(props) {
        if (props.userInfo.role == "root" || props.userInfo.role == "admin") {
            this.updateRegistersList()
        }
        this.setState(props)
    }

    onClickActionUser(action, userItem) {
        if (action == "info") {
            this.setState({currUser: userItem})
            $("#userInfoModal").modal("show")
        } else {
            this.props.onConfirm(Language.textMap("Danger"), 
                    Language.textMap("Whether to ")+Language.textMap(action)+" "+userItem.account+" ?", (()=>{
                HttpUtils.delete("/api/admin/user/"+userItem.account, {}, ((data) => {
                    this.updateUsersList()
                }).bind(this), ((data) => {
                    HttpUtils.alert("["+data.status+"] "+data.responseText)
                }))
            }).bind(this))
        }
    }

    onClickActionRegister(action, registerItem) {
        if (action == "info") {
            this.setState({currRegister: registerItem})
            $("#registerInfoModal").modal("show")
        } else {
            this.props.onConfirm(Language.textMap("Warning"), 
                    Language.textMap("Whether to ")+Language.textMap(action)+" "+registerItem.email+" ?", (()=>{
                HttpUtils.post("/api/admin/register", {
                    action: action,
                    account: registerItem.account,
                }, ((data) => {
                    this.updateUsersList()
                    this.updateRegistersList()
                }).bind(this), ((data) => {
                    HttpUtils.alert("["+data.status+"] "+data.responseText)
                }))
            }).bind(this))
        }
    }

    onChangePassword(key, event) {
        if (key == "newPassword") {
            this.state.password.newPassword = event.target.value
        } else if (key == "reNewPassword") {
            this.state.password.reNewPassword = event.target.value
        }

        if (this.state.password.newPassword != this.state.password.reNewPassword) {
            this.state.password.hasError = true
        } else {
            this.state.password.hasError = false
        }
        this.setState({})
    }

    onClickResetPassword(user) {
        this.setState({
            password: {
                oldPassword: "",
                newPassword: "",
                reNewPassword: "",
                hasError: false,
            },
            currUser: user,
        })
        $("#resetPasswordModal").modal("show")
    }

    onResetPassword() {
        if (this.state.password.newPassword != this.state.password.reNewPassword) {
            return
        }
        $("#resetPasswordModal").modal("hide")
        
        HttpUtils.post("/api/root/reset_password", {
            account: this.state.currUser.account,
            password: md5.hex(this.state.password.newPassword),
        }, ((data) => {
            HttpUtils.notice(Language.textMap("Success to reset password")+" !")
        }).bind(this), ((data) => {
            HttpUtils.alert("["+data.status+"] "+data.responseText)
        }).bind(this))
    }

    render() {
        return (
            <div className="users_manager clearfix">
                <div className={["lowtea-users-table", {true: "col-md-9 col-lg-9 col-sm-9", false:""}[this.state.userInfo.role=="root"||this.state.userInfo.role=="admin"]].join(" ")}>
                    <div className="panel panel-default">
                        <div className="panel-heading lowtea-table" style={{width:"100%"}}>
                            <div className="lowtea-table-cell" style={{width:"99%"}}>
                                {Language.textMap("Members")}
                            </div>
                            <div className="lowtea-table-cell" style={{width:"1%"}}>
                                {this.state.rootEmail}
                            </div>
                        </div>

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>{Language.textMap("Head Picture")}</th>
                                    <th>{Language.textMap("Account")}</th>
                                    <th>{Language.textMap("Nick Name")}</th>
                                    <th>{Language.textMap("Role")}</th>
                                    <th>{Language.textMap("Email")}</th>
                                    <th>{Language.textMap("Action")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.users.map((user) => {
                                        return (
                                            <tr key={user.account}>
                                                <td className="head-img"><img src={{true:"/img/head.png",false:user.headimg}[user.headimg==""]} style={{width:"30px",height:"30px"}}/></td>
                                                <td>{user.account}</td>
                                                <td>{user.nickname}</td>
                                                <td style={{display:{false: "table-cell", true:"none"}[user.isEdit]}}>
                                                    {Language.textMap(user.role)}
                                                </td>
                                                <td style={{display:{true: "table-cell", false:"none"}[user.isEdit]}}>
                                                    <select className="form-control" style={{height:"auto"}} value={user.copy.role} onChange={(event)=>{user.copy.role = event.target.value}}>
                                                        <option value="member">{Language.textMap("Member")}</option>
                                                        <option value="admin">{Language.textMap("Admin")}</option>
                                                    </select>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <a type="button" className="btn btn-info btn-xs" href={"#/personaldocs_list/" + user.account} style={{marginRight: "10px"}}>{Language.textMap("Documents")}</a>
                                                    <button type="button" className="btn btn-info btn-xs" onClick={this.onClickActionUser.bind(this, "info", user)}>{Language.textMap("Detail")}</button>
                                                    <div style={{display:{true:"inline-block", false:"none"}[this.props.userInfo.role=="admin"||this.props.userInfo.role=="root"]}}>
                                                        <button type="button" className="btn btn-warning btn-xs" style={{display:{false: "inline-block", true:"none"}[user.isEdit]}} onClick={this.showUserEdit.bind(this, user)}>{Language.textMap("Edit")}</button>
                                                        <button type="button" className="btn btn-warning btn-xs" style={{display:{true: "inline-block", false:"none"}[user.isEdit]}} onClick={this.cancelUserEdit.bind(this, user)}>{Language.textMap("Cancel")}</button>
                                                        <button type="button" className="btn btn-warning btn-xs" style={{display:{true: "inline-block", false:"none"}[user.isEdit]}} onClick={this.saveUserEdit.bind(this, user)}>{Language.textMap("Save")}</button>
                                                    </div>
                                                    <div style={{display:{true:"inline-block",false:"none"}[this.props.userInfo.role=="root"||(this.props.userInfo.role=="admin"&&user.role=="member")]}}>
                                                        <button type="button" className="btn btn-danger btn-xs" onClick={this.onClickActionUser.bind(this, "delete", user)}>{Language.textMap("Delete")}</button>
                                                    </div>
                                                    {
                                                        {
                                                            true: (
                                                                <button type="button" className="btn btn-danger btn-xs" onClick={this.onClickResetPassword.bind(this, user)}>{Language.textMap("Reset Password")}</button>           
                                                            ),
                                                        }[this.props.userInfo.role=="root"]
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-md-3 col-lg-3 col-sm-3 lowtea-table" style={{display:{true: "block", false: "none"}[this.state.userInfo.role=="root"||this.state.userInfo.role=="admin"]}}>
                    <div className="panel panel-default">
                        <div className="panel-heading">{Language.textMap("Registers")}</div>

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>{Language.textMap("Action")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.registers.map((registerItem) => {
                                        return (
                                            <tr key={registerItem.account}>
                                                <td>{registerItem.email}</td>
                                                <td>
                                                    <button type="button" className="btn btn-info btn-xs" onClick={this.onClickActionRegister.bind(this, "info", registerItem)}>{Language.textMap("Detail")}</button>
                                                    <button type="button" className="btn btn-danger btn-xs" onClick={this.onClickActionRegister.bind(this, "deny", registerItem)}>{Language.textMap("Deny")}</button>
                                                    <button type="button" className="btn btn-warning btn-xs" onClick={this.onClickActionRegister.bind(this, "agree", registerItem)}>{Language.textMap("Agree")}</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="modal fade" id="userInfoModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <h4 className="modal-title" id="myModalLabel">{"currUser" in this.state ? this.state.currUser.account:''}</h4>
                            </div>
                            <div className="modal-body">
                                <table className="lowtea-userinfo-table">
                                    <tbody>
                                        <tr>
                                            <td className="line-key">Email:</td>
                                            <td className="line-value">{"currUser" in this.state ? this.state.currUser.email:''}</td>
                                        </tr>
                                        <tr>
                                            <td className="line-key">{Language.textMap("Role")}:</td>
                                            <td className="line-value">{"currUser" in this.state ? this.state.currUser.role:''}</td>
                                        </tr>
                                        <tr>
                                            <td className="line-key">{Language.textMap("User Introduce")}:</td>
                                            <td className="line-value">{"currUser" in this.state ? this.state.currUser.userintro:''}</td>
                                        </tr>
                                        <tr>
                                            <td className="line-key">{Language.textMap("Gender")}:</td>
                                            <td className="line-value">{"currUser" in this.state ? this.state.currUser.gender:''}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="registerInfoModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <h4 className="modal-title" id="myModalLabel">
                                    {"currRegister" in this.state ? this.state.currRegister.account:''}的申请详情
                                    <span className="badge">{"currRegister" in this.state ? this.state.currRegister.email:''}</span>
                                </h4>
                            </div>
                            <div className="modal-body">
                                { "currRegister" in this.state ? this.state.currRegister.resume:''}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="resetPasswordModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <h4 className="modal-title" id="myModalLabel">{Language.textMap("Change Password")}</h4>
                            </div>
                            <div className="modal-body">
                                <form className="form-horizontal" role="form">
                                    <div className="form-group">
                                        <label className="col-sm-4 control-label">{Language.textMap("New Password")}</label>
                                        <div className="col-sm-8">
                                            <input type="password" className="form-control" value={this.state.password.newPassword} onChange={this.onChangePassword.bind(this, "newPassword")}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-4 control-label">{Language.textMap("Repeat New Password")}</label>
                                        <div className="col-sm-8">
                                            <input type="password" className={["form-control", {true:"input-error"}[this.state.password.hasError]].join(" ")} value={this.state.password.reNewPassword} onChange={this.onChangePassword.bind(this, "reNewPassword")}/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">{Language.textMap("Cancel")}</button>
                                <button type="button" className="btn btn-primary" onClick={this.onResetPassword.bind(this)}>
                                    {Language.textMap("Save")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
