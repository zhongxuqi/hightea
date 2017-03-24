import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';

import PublicDocsOverView from './components/publicdocs_overview/publicdocs_overview.jsx';
import PublicDocReader from './components/publicdoc_reader/publicdoc_reader.jsx'

import DocEditor from './components/doc_editor/doc_editor.jsx'

import HttpUtils from './utils/http.jsx'
import Language from './language/language.jsx'

import './public.less';

export default class PublicMain extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmModal: {
                title: "",
                message: "",
            },
            rootEmail: "",
        }
        
        HttpUtils.get("/openapi/rootinfo",{},((resp)=>{
            this.setState({rootEmail:resp.rootEmail})
        }).bind(this), (resp)=>{
            HttpUtils.alert("["+resp.status+"] "+resp.responseText)
        })
        
        HttpUtils.get('/api/member/self', {}, ((resp) => {
            window.location = "/user.html?lang="+resp.user.language
        }).bind(this), ((data) => {
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
            <div>
                <nav className="navbar navbar-inverse topbar" role="navigation">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand"><img alt="Brand" src="/img/icon_reverse.png"/></a>
                        </div>

                        <div className="collapse navbar-collapse">
                            <ul className="nav navbar-nav btn-menu">
                            </ul>
                            <ul className="nav navbar-nav navbar-right btn-menu">
                                <li className="dropdown">
                                    <a className="dropdown-toggle" data-toggle="dropdown">{Language.currLang.value} <span className="caret"></span></a>
                                    <ul className="dropdown-menu" role="menu">
                                        {
                                            Language.languages.map(((lang, i)=>{
                                                return <li key={i}><a onClick={(()=>{
                                                    window.location = "?lang=" + lang.short
                                                }).bind(this)}>{lang.value}</a></li>
                                            }).bind(this))
                                        }
                                    </ul>
                                </li>
                                <li><a href={"/login.html?lang="+Language.currLang.short}>{Language.textMap("Login In")}</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="col-md-12 col-xs-12" style={{padding:"0px", margin:"0px"}}>
                    {
                        React.cloneElement(this.props.children, {
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

render((
  <Router history={hashHistory}>
    <Route path="/" component={PublicMain}>
      <IndexRoute component={PublicDocsOverView}/>
      <Route path="publicdoc_reader/:id" component={PublicDocReader}/>
    </Route>
  </Router>
), document.getElementById('app'));
