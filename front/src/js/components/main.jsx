import React from 'react'

import HttpUtil from '../utils/http.jsx'
import Menu from './menu/menu.jsx'

export default class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.updateUserInfo()
    }

    updateUserInfo() {
        HttpUtil.get('/api/member/self', {}, ((data) => {
            console.log(data)
            this.setState({
                nickname: data.user.nickname, 
                userintro: data.user.userintro,
                gender: data.user.gender, 
                role: data.user.role, 
                language: data.user.language,
            })
        }).bind(this), ((data) => {
            window.location.pathname = "/login.html"
        }).bind(this))
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
                            userintro: this.state.userintro,
                            gender: this.state.gender,
                            role: this.state.role,
                            language: this.state.language,
                            updateUserInfo: this.updateUserInfo.bind(this),
                        })
                    }
                </div>
            </div>
        )
    }
}