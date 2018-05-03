import MainApp from 'Containers/mainApp';
import MainFormBlock from 'Containers/MainForm';
import React from 'react';
import { render } from 'react-dom';
import { localeReducer } from 'react-localize-redux';
import { Provider } from 'react-redux'
import configureStore from 'store/configureStore';
import { Router, Route, IndexRoute, browserHistory, Switch, hashHistory} from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import 'css/app.css'
const store = configureStore();


render(<Provider store={store}>

         <MainApp />
      </Provider>,
    document.getElementById('root')
);