import React from 'react';

import HttpUtils from '../../utils/http.jsx'

import './users_manager.less'

export default class UsersManager extends React.Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            users: [],
            registers: [],
        }
        this.updateUsersList()
        if ('role' in this.props && (this.props.role == "root" || this.props.role == "admin")) {
            this.updateRegistersList()
        }
    }

    updateUsersList() {
        HttpUtils.get("/api/user/users", {}, ((data) => {
            if (data['users'] == undefined) data['users'] = []
            this.setState({users: data['users']})
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

    onClickActionRegister(action, registerItem) {
        if (action == "info") {
            this.setState({currRegister: registerItem})
            $("#registerInfoModal").modal("show")
        } else {
            console.log(registerItem)
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
                                            <tr>
                                                <td>{user.nickname}</td>
                                                <td>{user.role}</td>
                                                <td>
                                                    <button type="button" className="btn btn-warning btn-xs" data-toggle="modal" data-target="#userInfoModal">修改</button>
                                                    <button type="button" className="btn btn-danger btn-xs">删除</button>
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
                                            <tr>
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
                            <h4 className="modal-title" id="myModalLabel">Modal title</h4>
                        </div>
                        <div className="modal-body">
                            ...
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
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