import React from 'react';

import './users_manager.less'

export default class UsersManager extends React.Component {
    render() {
        return (
            <div className="users_manager clearfix">
                <div className="col-md-8 lowtea-table">
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
                                <tr>
                                    <td>钟徐琦</td>
                                    <td>管理员</td>
                                    <td>
                                        <button type="button" className="btn btn-warning btn-xs" data-toggle="modal" data-target="#userInfoModal">修改</button>
                                        <button type="button" className="btn btn-danger btn-xs">删除</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>王笑笑</td>
                                    <td>管理员</td>
                                    <td>
                                        <button type="button" className="btn btn-warning btn-xs" data-toggle="modal" data-target="#userInfoModal">修改</button>
                                        <button type="button" className="btn btn-danger btn-xs">删除</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-md-4 lowtea-table">
                    <div className="panel panel-default">
                        <div className="panel-heading">加入申请</div>

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>用户名</th>
                                    <th>时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>钟徐琦</td>
                                    <td>1天前</td>
                                    <td>
                                        <button type="button" className="btn btn-info btn-xs">详情</button>
                                        <button type="button" className="btn btn-danger btn-xs">拒绝</button>
                                        <button type="button" className="btn btn-warning btn-xs">同意</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>王笑笑</td>
                                    <td>2天前</td>
                                    <td>
                                        <button type="button" className="btn btn-info btn-xs">详情</button>
                                        <button type="button" className="btn btn-danger btn-xs">拒绝</button>
                                        <button type="button" className="btn btn-warning btn-xs">同意</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="modal fade" id="userInfoModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
            </div>
        )
    }
}