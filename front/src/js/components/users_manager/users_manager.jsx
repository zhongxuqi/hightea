import React from 'react';

import HttpUtils from '../../utils/http.jsx'

import './users_manager.less'

export default class UsersManager extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            registers: [],
        }
        this.updateUsersList()
        if ('role' in this.props && (this.props.role == "root" || this.props.role == "admin")) {
            this.updateRegistersList()
        }
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
        $.confirm({
            title: 'warning',
            content: "save the change of "+userObj.account,
            buttons: {
                confirm: () => {
                    HttpUtils.post("/api/admin/user/"+userObj.account, {
                        role: userObj.copy.role,
                    }, ((data) => {
                        this.updateUsersList()
                    }).bind(this), ((data) => {
                        HttpUtils.alert("["+data.status+"] "+data.responseText)
                    }))
                },
                cancel: () => {},
            }
        })
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

    componentWillReceiveProps(newProps) {
        if ('role' in newProps && newProps.role != this.state.role && (newProps.role == "root" || newProps.role == "admin")) {
            this.updateRegistersList()
        }
        this.setState(newProps)
    }

    onClickActionUser(action, userItem) {
        if (action == "info") {
            this.setState({currUser: userItem})
            $("#userInfoModal").modal("show")
        } else {
            $.confirm({
                title: 'danger',
                content: action+" the user of "+userItem.account,
                buttons: {
                    confirm: () => {
                        HttpUtils.delete("/api/admin/user/"+userItem.account, {}, ((data) => {
                            this.updateUsersList()
                        }).bind(this), ((data) => {
                            HttpUtils.alert("["+data.status+"] "+data.responseText)
                        }))
                    },
                    cancel: () => {},
                }
            })
        }
    }

    onClickActionRegister(action, registerItem) {
        if (action == "info") {
            this.setState({currRegister: registerItem})
            $("#registerInfoModal").modal("show")
        } else {
            $.confirm({
                title: 'warning',
                content: action+" the register of "+registerItem.email,
                buttons: {
                    confirm: () => {
                        HttpUtils.post("/api/admin/register", {
                            action: action,
                            account: registerItem.account,
                        }, ((data) => {
                            this.updateUsersList()
                            this.updateRegistersList()
                        }).bind(this), ((data) => {
                            HttpUtils.alert("["+data.status+"] "+data.responseText)
                        }))
                    },
                    cancel: () => {},
                }
            })
        }
    }

    render() {
        return (
            <div className="users_manager clearfix">
                <div className={["lowtea-table", {true: "col-md-8", false:""}[this.state.role=="root"||this.state.role=="admin"]].join(" ")}>
                    <div className="panel panel-default">
                        <div className="panel-heading">社区成员</div>

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>用户名</th>
                                    <th>用户角色</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.users.map((user) => {
                                        return (
                                            <tr key={user.account}>
                                                <td>{user.nickname}</td>
                                                <td style={{display:{false: "table-cell", true:"none"}[user.isEdit]}}>{user.role}</td>
                                                <td style={{display:{true: "table-cell", false:"none"}[user.isEdit]}}>
                                                    <select className="form-control" style={{height:"auto"}} value={user.copy.role} onChange={(event)=>{user.copy.role = event.target.value}}>
                                                        <option value="member">成员</option>
                                                        <option value="admin">管理员</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button type="button" className="btn btn-info btn-xs" onClick={this.onClickActionUser.bind(this, "info", user)}>详情</button>
                                                    <button type="button" className="btn btn-warning btn-xs" style={{display:{false: "inline-block", true:"none"}[user.isEdit]}} onClick={this.showUserEdit.bind(this, user)}>编辑</button>
                                                    <button type="button" className="btn btn-warning btn-xs" style={{display:{true: "inline-block", false:"none"}[user.isEdit]}} onClick={this.cancelUserEdit.bind(this, user)}>取消</button>
                                                    <button type="button" className="btn btn-warning btn-xs" style={{display:{true: "inline-block", false:"none"}[user.isEdit]}} onClick={this.saveUserEdit.bind(this, user)}>保存</button>
                                                    <button type="button" className="btn btn-danger btn-xs" onClick={this.onClickActionUser.bind(this, "delete", user)}>删除</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-md-4 lowtea-table" style={{display:{true: "block", false: "none"}[this.state.role=="root"||this.state.role=="admin"]}}>
                    <div className="panel panel-default">
                        <div className="panel-heading">加入申请</div>

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.registers.map((registerItem) => {
                                        return (
                                            <tr key={registerItem.account}>
                                                <td>{registerItem.email}</td>
                                                <td>
                                                    <button type="button" className="btn btn-info btn-xs" onClick={this.onClickActionRegister.bind(this, "info", registerItem)}>详情</button>
                                                    <button type="button" className="btn btn-danger btn-xs" onClick={this.onClickActionRegister.bind(this, "deny", registerItem)}>拒绝</button>
                                                    <button type="button" className="btn btn-warning btn-xs" onClick={this.onClickActionRegister.bind(this, "agree", registerItem)}>同意</button>
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
                                <h4 className="modal-title" id="myModalLabel">{"currUser" in this.state ? this.state.currUser.account:''}的用户详情</h4>
                            </div>
                            <div className="modal-body">
                                <table className="lowtea-userinfo-table">
                                    <tbody>
                                        <tr>
                                            <td className="line-key">Email:</td>
                                            <td className="line-value">{"currUser" in this.state ? this.state.currUser.email:''}</td>
                                        </tr>
                                        <tr>
                                            <td className="line-key">Role:</td>
                                            <td className="line-value">{"currUser" in this.state ? this.state.currUser.role:''}</td>
                                        </tr>
                                        <tr>
                                            <td className="line-key">用户简介:</td>
                                            <td className="line-value">{"currUser" in this.state ? this.state.currUser.userintro:''}</td>
                                        </tr>
                                        <tr>
                                            <td className="line-key">Gender:</td>
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
            </div>
        )
    }
}