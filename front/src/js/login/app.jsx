import React from 'react';
import { render } from 'react-dom';
import md5 from 'js-md5'

import HttpUtils from '../utils/http.jsx'
import Language from '../language/language.jsx'

import './app.less'

class LoginApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formState: 'login',
            loginAccount: '',
            loginPassword: '',
            registerAccount: '',
            registerNickname: '',
            registerEmail: '',
            registerResume: '',
            registerPassword: '',
            registerRePassword: '',
            registerRePassword_state: '',
        }
        
        HttpUtils.get('/api/member/self', {}, ((data) => {
            window.location = "/user.html"
        }).bind(this), ((data) => {
        }).bind(this))
    }

    handleStateChange(stateName, event) {
        let updates = {}
        updates[stateName] = event.target.value

        // check register password
        let registerPassword, registerRePassword
        if ('registerPassword' in updates) {
            registerPassword = updates['registerPassword']
        } else {
            registerPassword = this.state.registerPassword
        }
        if ('registerRePassword' in updates) {
            registerRePassword = updates['registerRePassword']
        } else {
            registerRePassword = this.state.registerRePassword
        }
        
        if (registerPassword != registerRePassword) {
            updates['registerRePassword_state'] = 'input-error'
        } else {
            updates['registerRePassword_state'] = ''
        }

        this.setState(updates)
    }

    handleFormClick(formName) {
        return (() => {
            this.setState({formState: formName})
        })
    }

    onClickLoginBtn() {
        if ("loginAccount" in this.state && "loginPassword" in this.state) {
            let account = this.state.loginAccount, 
                password = this.state.loginPassword,
                expireTime = Math.floor(new Date().getTime() / 1000 + 60)
            let sign = md5.hex(account + md5.hex(password) + expireTime)
            
            HttpUtils.post("/openapi/login", {
                account: account,
                expireTime: expireTime,
                sign: sign,
            }, (data) => {
                window.location = "/user.html?lang="+data.user.language
            }, (data) => {
                HttpUtils.alert("["+data.status+"]: "+data.responseText)
            })
        }
    }

    onClickRegisterBtn() {
        if (this.state.registerRePassword_state.length > 0 || 
                this.state.registerPassword.length <= 0) return
        HttpUtils.post("/openapi/register", {
            account: this.state.registerAccount,
            nickname: this.state.registerNickname,
            email: this.state.registerEmail,
            resume: this.state.registerResume,
            password: md5.hex(this.state.registerPassword),
        }, ((data) => {
            HttpUtils.notice(Language.textMap("Register has sent, wait for callback"))
            this.setState({
                registerAccount: '',
                registerNickname: "",
                registerEmail: '',
                registerResume: '',
                registerPassword: '',
                registerRePassword: '',
                registerRePassword_state: '',
                formState: 'login',
            })
        }).bind(this), ((data) => {
            HttpUtils.alert("["+data.status+"]: "+data.responseText)
        }).bind(this))
    }

    render() {
        return (
            <div className="lowtea-login-container">
                <img className="lowtea-logo" src="/img/logo2.png"/>
                <div className="lowtea-login-form">
                    <form className="clearfix" style={{display:{true: "block", false: "none"}[this.state.formState=="login"]}}>
                        <div className="orm-group">
                            <label>{Language.textMap("Account")}</label>
                            <input className="form-control" value={this.state.loginAccount} onChange={this.handleStateChange.bind(this, "loginAccount")}/>
                        </div>
                        <div className="form-group">
                            <label>{Language.textMap("Password")}</label>
                            <input type="password" className="form-control" value={this.state.loginPassword} onChange={this.handleStateChange.bind(this, "loginPassword")}/>
                        </div>
                        <button type="button" className="btn btn-success btn-block" style={{marginBottom:"10px"}} onClick={this.onClickLoginBtn.bind(this)}>{Language.textMap("Login In")}</button>
                        <button type="button" className="btn btn-primary btn-sm pull-left" href="" onClick={()=>{
                            window.location="/index.html"
                        }}>{Language.textMap("Guest")}</button>
                        <button type="button" className="btn btn-link pull-right" href="" onClick={this.handleFormClick('register')}>
                            {Language.textMap("Register")}
                        </button>
                    </form>

                    <form className="clearfix" style={{display:{true: "block", false: "none"}[this.state.formState=="register"]}}>
                        <div className="form-group">
                            <label>{Language.textMap("Account")}</label>
                            <input className="form-control" value={this.state.registerAccount} onChange={this.handleStateChange.bind(this, "registerAccount")}/>
                        </div>
                        <div className="form-group">
                            <label>{Language.textMap("Nick Name")}</label>
                            <input className="form-control" value={this.state.registerNickname} onChange={this.handleStateChange.bind(this, "registerNickname")}/>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" className="form-control" value={this.state.registerEmail} onChange={this.handleStateChange.bind(this, "registerEmail")}/>
                        </div>
                        <div className="form-group">
                            <label>{Language.textMap("Resume")}</label>
                            <textarea type="password" className="form-control" value={this.state.registerResume} onChange={this.handleStateChange.bind(this, "registerResume")}></textarea>
                        </div>
                        <div className="form-group">
                            <label>{Language.textMap("Password")}</label>
                            <input type="password" className="form-control" value={this.state.registerPassword} onChange={this.handleStateChange.bind(this, "registerPassword")}/>
                        </div>
                        <div className="form-group">
                            <label>{Language.textMap("Repeat Password")}</label>
                            <input type="password" className={["form-control", this.state.registerRePassword_state].join(" ")} value={this.state.registerRePassword} onChange={this.handleStateChange.bind(this, "registerRePassword")}/>
                        </div>
                        <button type="button" className="btn btn-success btn-block" onClick={this.onClickRegisterBtn.bind(this)}>
                            {Language.textMap("Register")}
                        </button>
                        <button type="button" className="btn btn-link pull-right" href="" onClick={this.handleFormClick('login')}>
                            {Language.textMap("Login In")}
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

render((
  <LoginApp></LoginApp>
), document.getElementById('app'));
