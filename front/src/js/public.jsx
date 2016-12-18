import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';

import './app.less';

import PublicMain from './components/public_main.jsx';
import PublicDocsOverView from './components/publicdocs_overview/publicdocs_overview.jsx';
import PublicDocReader from './components/publicdoc_reader/publicdoc_reader.jsx'

import DocEditor from './components/doc_editor/doc_editor.jsx'

render((
  <Router history={hashHistory}>
    <Route path="/" component={PublicMain}>
      <IndexRoute component={PublicDocsOverView}/>
      <Route path="publicdoc_reader/:id" component={PublicDocReader}/>
    </Route>
  </Router>
), document.getElementById('app'));
