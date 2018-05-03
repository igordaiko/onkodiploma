import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import Loader from 'react-loader-advanced';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
// UTILS
import injectTapEventPlugin from 'react-tap-event-plugin';
import URI  from 'urijs';
import he from 'he';
import classNames from 'classnames';
import moment from "moment";
import { Router, Route, IndexRoute, browserHistory, Switch, hashHistory} from 'react-router';
import { createHashHistory } from 'history';

//actions
import * as actions from 'actions/contentActions'
// THEMES
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import defaultTheme from 'theme/Themes';
//components
import MainFormBlock from 'Containers/MainForm';
import StartPage from 'Containers/StartPage';

import _ from 'lodash';
import { Link } from 'react-router-dom'



export const history = createHashHistory();

injectTapEventPlugin();
export  class MainApp extends Component {
    constructor(props) {
        super(props);
        var self = this;
        this.state = {};        
    }
    componentDidMount() {
        let lang = window.lang;
        this.props.myActions.getQuestions(lang);
    }
    getChildContext() {
        return {
            muiTheme: getMuiTheme(defaultTheme),
            myActions: this.props.myActions,
            regions: this.props.regions,
            questions: this.props.questions,
            answers: this.props.answers,
            districts: this.props.districts
        };
    }  
    componentWillUpdate(nextProps, nextState) {
        if (!_.isEqual(this.props.resources, nextProps.resources)) {
            this.forceUpdate();
        }

    } 
    touchEvent(val) {
        let value = val;
    }
    render() {
        return <div>
             <Router history={history}>
             <Switch>
                <Route path="/" component={MainFormBlock} />
              </Switch>
             </Router>
        </div>;
               
    }
}

MainApp.childContextTypes = {
    muiTheme: PropTypes.object.isRequired,
    regions: PropTypes.array,
    questions: PropTypes.array,
    myActions: PropTypes.object,
    districts: PropTypes.array,
    answers: PropTypes.array,
    cities:PropTypes.array
};
function mapStateToProps(state) {
    return {
        resources: state.contentReducer.resources,
        regions: state.contentReducer.regions,
        districts: state.contentReducer.districts,
        questions: state.contentReducer.questions,
        answers: state.contentReducer.answers,
        questionsLoading: state.contentReducer.questionsLoading,
        cities: state.contentReducer.cities
    }
}

function mapDispatchToProps(dispatch) {return {
    myActions: bindActionCreators(actions, dispatch)
}}
export default connect(mapStateToProps, mapDispatchToProps)(MainApp);