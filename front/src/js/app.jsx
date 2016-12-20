import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';

import DocsOverView from './components/docs_overview/docs_overview.jsx';
import PersonalDocsList from './components/personaldocs_list/personaldocs_list.jsx'
import StarDocsList from './components/stardocs_list/stardocs_list.jsx'
import PersonalDraftsList from './components/personaldrafts_list/personaldrafts_list.jsx'
import UserSettings from './components/user_settings/user_settings.jsx'
import UsersManager from './components/users_manager/users_manager.jsx'
import DocReader from './components/doc_reader/doc_reader.jsx'

import DocEditor from './components/doc_editor/doc_editor.jsx'

import HttpUtil from './utils/http.jsx'
import Menu from './components/menu/menu.jsx'

import './app.less';

export default class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: {},
            confirmModal: {
                title: "",
                message: "",
            },
        }
        this.updateUserInfo()
    }

    updateUserInfo() {
        HttpUtil.get('/api/member/self', {}, ((resp) => {
            this.setState({
                userInfo: resp.user,
            })
        }).bind(this), ((data) => {
            window.location = "/index.html"
        }).bind(this))
    }

    onConfirm(title, message, callback, cancelCallback) {
        $("#confirmModal").off("show.bs.modal")
        $("#confirmModal").off("hide.bs.modal")
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
        $("#confirmModal").on("hide.bs.modal", () => {
            $("#confirmModal #confirmAffirmBtn").off("click")
            $("#confirmModal #confirmCancelBtn").off("click")
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
                    <Menu userInfo={this.state.userInfo}></Menu>
                </div>
                <div className="col-md-10 col-xs-10" style={{padding:"0px", margin:"0px", height:'100%'}}>
                    {
                        React.cloneElement(this.props.children, {
                            userInfo: this.state.userInfo,
                            onConfirm: this.onConfirm.bind(this),
                            updateUserInfo: this.updateUserInfo.bind(this),
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
    <Route path="/" component={Main}>
      <IndexRoute component={DocsOverView}/>
      <Route path="doc_editor" component={DocEditor}/>
      <Route path="stardocs_list" component={StarDocsList}/>
      <Route path="personaldocs_list" component={PersonalDocsList}/>
      <Route path="users_manager" component={UsersManager}/>
      <Route path="user_settings" component={UserSettings}/>
      <Route path="doc_reader/:id" component={DocReader}/>

      <Route path="personaldrafts_list" component={PersonalDraftsList}/>
    </Route>
  </Router>
), document.getElementById('app'));
