import React from 'react';

import './user_settings.less'

export default class UserSettings extends React.Component {
    render() {
        return (
            <div className="lowtea-user-settings clearfix">
                <h4 className="lowtea-group-title">用户信息</h4>

                <form className="form-horizontal lowtea-user-info" role="form">
                    <div className="form-group">
                        <label className="col-sm-2 control-label">用户名</label>
                        <div className="col-sm-10">
                            <input className="form-control"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">密码</label>
                        <div className="col-sm-10">
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#passwordModal">修改密码</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">个性签名</label>
                        <div className="col-sm-10">
                            <input className="form-control"/>
                        </div>
                    </div>
                </form>

                <h4 className="lowtea-group-title">其它设置</h4>

                <form className="form-horizontal lowtea-user-info" role="form">
                    <div className="form-group">
                        <label className="col-sm-2 control-label">语言选择</label>
                        <div className="col-sm-10">
                            <select className="form-control">
                                <option>English</option>
                                <option>Chinese</option>
                            </select>
                        </div>
                    </div>
                </form>


                <div className="modal fade" id="passwordModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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