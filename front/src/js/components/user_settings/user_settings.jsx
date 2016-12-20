import React from 'react';

import HttpUtils from '../../utils/http.jsx'
import LowTea from '../../utils/lowtea.jsx'

import './user_settings.less'

export default class UserSettings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: this.props.userInfo,
            userinfoEdit: false,
            password: {
                oldPassword: "",
                newPassword: "",
                reNewPassword: "",
                status: "",
            },
            headStatus:"choose",
        }
        this.state.copy = this.copyUser(this.state.user)
        this.updateUserInfo = this.props.updateUserInfo
    }

    componentWillReceiveProps(props) {
        this.setState({
            user: props.userInfo,
            userinfoEdit: false,
        })
        this.setState({
            copy: this.copyUser(props.userInfo),
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
            headimg: user.headimg,
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
        } else if (key == "headimg") {
            this.state.copy.img = event.target.value
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
            headimg: this.state.copy.headimg,
            email: this.state.copy.email, 
            userintro: this.state.copy.userintro, 
            gender: this.state.copy.gender,
            language: this.state.copy.language,
        }, ((resp) => {
            console.log(resp)
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

    modalHeadImg() {
        if (!this.state.userinfoEdit) return
        $("#headImgModal").modal("show")
    }

    onUploadImg() {
        let headImgfile = document.getElementById("headImgFile").files[0]

        if (headImgfile == null) {
            HttpUtils.alert("请选择图片")
            return
        } else if (!(/\.(png|jpeg|jpg)$/.test(headImgfile.name))) {
            HttpUtils.alert("所选文件不是图片")
            return
        }
        
        let formData = new FormData()
        formData.append("imagefile", headImgfile)
        $.ajax({
            type: "POST",
            url: "/api/member/upload_image",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: (resp) => {
                $("#modal-headimg-file").attr("src", resp.imageUrl)
                this.state.copy.headimg = resp.imageUrl
                this.setState({})
            },
            error: (resp) => {
                HttpUtils.alert("["+resp.status+"] "+resp.responseText)
            },
        })
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
                        <label className="col-sm-2 control-label">头像</label>
                        <div className="col-sm-10">
                            <img src={{true:"/img/head.png",false:this.state.user.headimg}[this.state.user.headimg==""]} style={{width:"100px",height:"100px", display:{false:"inline-block", true:"none"}[this.state.userinfoEdit]}}/>
                            <a className="head-img thumbnail" onClick={this.modalHeadImg.bind(this)} style={{display:{false:"none", true:"inline-block"}[this.state.userinfoEdit]}}>
                                <img src={{true:"/img/head.png",false:this.state.copy.headimg}[this.state.copy.headimg==""]} style={{width:"100px",height:"100px"}}/>
                            </a>
                        </div>
                    </div>
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
                
                <div className="modal fade" id="headImgModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <ul className="nav nav-pills" role="tablist">
                                    <li role="presentation" className={{true:"active", false:""}[this.state.headStatus=="choose"]}><a href="javascript:void(0)" onClick={(()=>{this.setState({headStatus:"choose"})}).bind(this)}>选择头像</a></li>
                                    <li role="presentation" className={{true:"active", false:""}[this.state.headStatus=="link"]}><a href="javascript:void(0)" onClick={(()=>(this.setState({headStatus:"link"})))}>头像链接</a></li>
                                    <li role="presentation" className={{true:"active", false:""}[this.state.headStatus=="file"]}><a href="javascript:void(0)" onClick={(()=>(this.setState({headStatus:"file"})))}>上传头像</a></li>
                                </ul>
                            </div>
                            <div className="modal-body">
                                <form role="form">
                                    <div className="form-group" style={{display:{true:"block",false:"none"}[this.state.headStatus=="choose"]}}>
                                        <div className="row">
                                            {
                                                LowTea.headImgs.map(((headImg, i)=>{
                                                    return (
                                                        <div className="col-xs-6 col-md-3" key={i}>
                                                            <a className={["thumbnail", {true:"active", false:""}[this.state.copy.headimg==headImg]].join(" ")} onClick={(()=>{this.state.copy.headimg=headImg;this.setState({});$("#headImgModal").modal("hide")}).bind(this)}>
                                                                <img src={headImg} style={{height:"100px"}}/>
                                                            </a>
                                                        </div>
                                                    )
                                                }).bind(this))
                                            }
                                        </div>
                                    </div>
                                    <div className="form-group" style={{display:{false:"none",true:"block"}[this.state.headStatus=="link"]}}>
                                        <label>头像链接</label>
                                        <input type="text" className="form-control" placeholder="Enter Video URL" value={this.state.copy.headimg} onChange={((event)=>{this.state.copy.headimg=event.target.value;this.setState({})}).bind(this)}/>
                                        <a className="thumbnail" style={{width:"100px",height:"100px",marginTop:"10px"}}>
                                            <img src={this.state.copy.headimg}/>
                                        </a>
                                    </div>
                                    <div className="form-group" style={{display:{true:"block",false:"none"}[this.state.headStatus=="file"]}}>
                                        <label>上传头像图片</label>
                                        <input type="file" id="headImgFile" onChange={this.onUploadImg.bind(this)}/>
                                        <a className="thumbnail" style={{width:"100px",height:"100px",marginTop:"10px"}}>
                                            <img id="modal-headimg-file"/>
                                        </a>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer" style={{display:{true:"block",false:"none"}[this.state.headStatus!="choose"]}}>
                                <button type="button" className="btn btn-default" data-dismiss="modal" onClick={(()=>{
                                    this.state.copy.headimg=this.state.user.headimg
                                    this.setState({})
                                }).bind(this)}>Close</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
