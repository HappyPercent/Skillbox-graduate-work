import MonserratTTF from './fonts/montserrat.ttf';
import MonserratWoff from './fonts/montserrat.woff';
import MonserratWoffTwo from './fonts/montserrat.woff2';
import './index.css';
import { createGlobalStyle } from 'styled-components';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducers from './reducers/reducers';
import Home from './containers/home';
import Authentication from './containers/Authentication';
import SinglePhoto from './containers/SinglePhoto';

const GlobalCSS = createGlobalStyle`
  @font-face {
    font-family: 'Monserrat';
    font-style: normal;
    font-weight: normal;
    src:
      url('${MonserratTTF}') format('ttf'),
      url('${MonserratWoff}') format('woff'),
      url('${MonserratWoffTwo}') format('woff2');
  }
  html, body {
    font-family: 'Monserrat', sans-serif;
  }
`;

document.querySelector('body').innerHTML = '<div class="root"></div>';

localStorage.setItem('page', 1);
localStorage.setItem('perPage', 12);

const store = createStore(reducers);
const customHistory = createBrowserHistory();

ReactDOM.render(
    <Provider store={ store }>
        <Router history={ customHistory }>
            <GlobalCSS />
            <Route path="/auth" component={ Authentication } />
            <Route path="/auth/:id" component={ SinglePhoto } />
            <Route exact path="/" component={ Home } />
        </Router>
    </Provider>,
    document.querySelector('.root')
);