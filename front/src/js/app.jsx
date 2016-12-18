import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';

import './app.less';

import Main from './components/main.jsx';
import DocsOverView from './components/docs_overview/docs_overview.jsx';
import PersonalDocsList from './components/personaldocs_list/personaldocs_list.jsx'
import StarDocsList from './components/stardocs_list/stardocs_list.jsx'
import PersonalDraftsList from './components/personaldrafts_list/personaldrafts_list.jsx'
import UserSettings from './components/user_settings/user_settings.jsx'
import UsersManager from './components/users_manager/users_manager.jsx'
import DocReader from './components/doc_reader/doc_reader.jsx'

import DocEditor from './components/doc_editor/doc_editor.jsx'

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
