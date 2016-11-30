import React from 'react'

import HttpUtil from '../utils/http.jsx'
import Menu from './menu/menu.jsx'

export default class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        HttpUtil.get('/api/user/userinfo', {}, ((data) => {
            this.setState({nickname: data.user.nickname, role: data.user.role})
        }).bind(this), ((data) => {
            window.location.pathname = "/login.html"
        }).bind(this))
    }

    render() {
        return (
            <div style={{height:'100%'}}>
                <div className="col-xs-2" style={{padding:"0px", margin:"0px", height:'100%'}}>
                    <Menu nickname={this.state.nickname} role={this.state.role}></Menu>
                </div>
                <div className="col-xs-10" style={{padding:"0px", margin:"0px", height:'100%'}}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}