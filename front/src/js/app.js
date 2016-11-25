import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import { render } from 'react-dom';

import '../less/app.less';

import Main from './components/main.jsx';

render((
  <Router history={hashHistory}>
    <Route path="/" component={Main}/>
  </Router>
), document.getElementById('app'));