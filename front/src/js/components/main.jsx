import React from 'react'

import HttpUtil from '../utils/http.jsx'
import Menu from './menu/menu.jsx'

export default class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmModal: {
                title: "",
                message: "",
            },
        }
        this.updateUserInfo()
    }

    updateUserInfo() {
        HttpUtil.get('/api/member/self', {}, ((data) => {
            this.setState({
                nickname: data.user.nickname,
                email: data.user.email,
                userintro: data.user.userintro,
                gender: data.user.gender,
                role: data.user.role,
                language: data.user.language,
            })
        }).bind(this), ((data) => {
            window.location.pathname = "/index.html"
        }).bind(this))
    }

    onConfirm(title, message, callback, cancelCallback) {
        $("#confirmModal").on("show.bs.modal", () => {
            $("#confirmModal #confirmAffirmBtn").on("click", () => {
                if (callback != undefined) callback()
                $("#confirmModal #confirmAffirmBtn").off("click")
                $("#confirmModal").modal("hide")
            })
            
            $("#confirmModal #confirmCancelBtn").on("click", () => {
                if (cancelCallback != undefined) cancelCallback()
                $("#confirmModal #confirmCancelBtn").off("click")
                $("#confirmModal").modal("hide")
            })
        })
        $("#confirmModal").on("hide", () => {
            $("#confirmModal #confirmAffirmBtn").off("click")
        })
        $("#confirmModal").modal("show")
        this.setState({
            confirmModal: {
                title: title,
                message: message,
            }
        })
    
    }

    render() {
        return (
            <div style={{height:'100%'}}>
                <div className="col-md-2 col-xs-2" style={{padding:"0px", margin:"0px", height:'100%'}}>
                    <Menu nickname={this.state.nickname} role={this.state.role}></Menu>
                </div>
                <div className="col-md-10 col-xs-10" style={{padding:"0px", margin:"0px", height:'100%'}}>
                    {
                        React.cloneElement(this.props.children, {
                            nickname: this.state.nickname,
                            email: this.state.email,
                            userintro: this.state.userintro,
                            gender: this.state.gender,
                            role: this.state.role,
                            language: this.state.language,
                            updateUserInfo: this.updateUserInfo.bind(this),
                            onConfirm: this.onConfirm.bind(this),
                        })
                    }
                </div>
                
                <div id="confirmModal" className="modal fade bs-example-modal-sm" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <h4 className="modal-title">{this.state.confirmModal.title}</h4>
                            </div>
                            <div className="modal-body">
                                <p>{this.state.confirmModal.message}</p>
                            </div>
                            <div className="modal-footer">
                                <button id="confirmCancelBtn" type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                                <button id="confirmAffirmBtn" type="button" className="btn btn-primary">确定</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
