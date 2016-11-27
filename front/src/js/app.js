import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';

import './app.less';

import Main from './components/main.jsx';
import PagesOverView from './components/pages_overview/pages_overview.jsx';
import PersonalPagesList from './components/personalpages_list/personalpages_list.jsx'
import FavoritePagesList from './components/favoritepages_list/favoritepages_list.jsx'
import PersonalDraftsList from './components/personaldrafts_list/personaldrafts_list.jsx'

render((
  <Router history={hashHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={PagesOverView}/>
      <Route path="personalpages_list" component={PersonalPagesList}/>
      <Route path="favoritepages_list" component={FavoritePagesList}/>
      <Route path="personaldrafts_list" component={PersonalDraftsList}/>
    </Route>
  </Router>
), document.getElementById('app'));