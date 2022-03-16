import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store-redux/index';
import {GlobalContext} from './store/GlobalContext'

ReactDOM.render(
  <React.StrictMode>
    <Router><Provider store={store}><GlobalContext><App /></GlobalContext></Provider></Router>
  </React.StrictMode>,
  document.getElementById('root')
);
