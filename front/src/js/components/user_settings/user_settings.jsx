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
            flagExpiredTime: 24 * 60 * 60,
        }
        this.state.copy = this.copyUser(this.state.user)
        this.updateUserInfo = this.props.updateUserInfo
        if (this.state.user.role=="root") this.getFlagExpiredTime()
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

    getFlagExpiredTime() {
        HttpUtils.get("/api/root/flag_expired_time",{},((resp)=>{
            this.setState({flagExpiredTime:resp.flagExpiredTime})
        }).bind(this),(resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        })
    }
    
    setFlagExpiredTime(flagExpiredTime) {
        HttpUtils.post("/api/root/flag_expired_time",{
            flagExpiredTime: flagExpiredTime,
        },((resp)=>{
            this.setState({flagExpiredTime:flagExpiredTime})
        }).bind(this),(resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
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
                        <label className="col-sm-3 control-label">头像</label>
                        <div className="col-sm-9">
                            <img src={{true:"/img/head.png",false:this.state.user.headimg}[this.state.user.headimg==""]} style={{width:"100px",height:"100px", display:{false:"inline-block", true:"none"}[this.state.userinfoEdit]}}/>
                            <a className="head-img thumbnail" onClick={this.modalHeadImg.bind(this)} style={{display:{false:"none", true:"inline-block"}[this.state.userinfoEdit]}}>
                                <img src={{true:"/img/head.png",false:this.state.copy.headimg}[this.state.copy.headimg==""]} style={{width:"100px",height:"100px"}}/>
                            </a>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-3 control-label">昵称</label>
                        <div className="col-sm-9">
                            <input className="form-control" style={{display:{true:"block", false:"none"}[this.state.userinfoEdit]}} value={this.state.copy.nickname} onChange={this.onChangeUserInfo.bind(this, "nickname")}/>
                            <p className="show-text" style={{display:{false:"block", true:"none"}[this.state.userinfoEdit]}}>{this.state.user.nickname}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-3 control-label">Email</label>
                        <div className="col-sm-9">
                            <input className="form-control" style={{display:{true:"block", false:"none"}[this.state.userinfoEdit]}} value={this.state.copy.email} onChange={this.onChangeUserInfo.bind(this, "email")}/>
                            <p className="show-text" style={{display:{false:"block", true:"none"}[this.state.userinfoEdit]}}>{this.state.user.email}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-3 control-label">个人签名</label>
                        <div className="col-sm-9">
                            <input className="form-control" style={{display:{true:"block", false:"none"}[this.state.userinfoEdit]}} value={this.state.copy.userintro} onChange={this.onChangeUserInfo.bind(this, "userintro")}/>
                            <p className="show-text" style={{display:{false:"block", true:"none"}[this.state.userinfoEdit]}}>{this.state.user.userintro}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-3 control-label">性别</label>
                        <div className="col-sm-9" style={{height:"27px"}}>
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
                        <label className="col-sm-3 control-label">Language</label>
                        <div className="col-sm-9">
                            <select className="form-control" value={this.state.copy.language} onChange={this.onLanguageClick.bind(this)}>
                                <option value="">English</option>
                                <option value="cn">中文</option>
                            </select>
                        </div>
                    </div>
                </form>
                
                <form className="form-horizontal lowtea-user-info" role="form">
                    <div className="form-group">
                        <label className="col-sm-3 control-label">Flag有效时间</label>
                        <div className="col-sm-9">
                            <select className="form-control" value={this.state.flagExpiredTime} onChange={((event)=>{
                                this.setFlagExpiredTime(parseInt(event.target.value))
                            }).bind(this)}>
                                {
                                    [{
                                        value: 24 * 60 * 60,
                                        text: "1天",
                                    }, {
                                        value: 3 * 24 * 60 * 60,
                                        text: "3天",
                                    }, {
                                        value: 1 * 24 * 60 * 60,
                                        text: "1周",
                                    }, {
                                        value: 14 * 24 * 60 * 60,
                                        text: "2周",
                                    }, {
                                        value: 30 * 24 * 60 * 60,
                                        text: "1个月",
                                    }].map((item, i)=>{
                                        return <option key={i} value={item.value}>{item.text}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </form>

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
