import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {connect} from 'react-redux';

import Paper from 'material-ui/Paper';
// UTILS
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import defaultTheme from 'theme/Themes';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';

import {
  Step,
  Stepper,
  StepButton,
  StepLabel
} from 'material-ui/Stepper';
import {Translate, I18n} from 'react-redux-i18n';
import Questionnaire from 'Containers/Questionnaire';
import Questions from 'Containers/Questions';
import Result from 'Containers/Result';
import _ from 'lodash';
import * as actions from 'actions/contentActions'
import { bindActionCreators } from 'redux'

const circularStyle = {
    marginTop: 10
}
const btnLabelStyle = {
    fontSize: 30
};
const iconStyles = {
    width: 36,
    height: 36,
    display: "flex",
    justifyContent: "center",
    color: "#fff",
    fontSize: 20,
    lineHeight: "36px",
    borderRadius: "100%",
}
const muiTheme = getMuiTheme({
    spacing: {
        iconSize: 29,
        desktopGutter: 24,
        desktopGutterMore: 32,
        desktopGutterLess: 16,
        desktopGutterMini: 8,
        desktopKeylineIncrement: 64,
        desktopDropDownMenuItemHeight: 32,
        desktopDropDownMenuFontSize: 15,
        desktopDrawerMenuItemHeight: 48,
        desktopSubheaderHeight: 48,
        desktopToolbarHeight: 56,
    },
    stepper: {
        textColor: '#fff',
        fontSize: 12,
        iconHeight: 26,
        connectorLineColor: "#fff",
        iconSize: 30,
        svgIcon: {
            textColor: "#fff",
            fontSize: 30,
            iconHeight: 30
        },
        stepLabel: {
            fontSize: 30,
        },
        iconContainer: {
            display: 'flex',
            alignItems: 'center',
            paddingRight: 8,
            width: 24

        }
    },

    circle: {
        color: 'green',
        height: 26,
        fontSize: 24

    },
    
})
export class MainFormBlock extends Component {
    constructor(props) {
        super(props);
        this.changeField = this.changeField.bind(this);
        this.save = this.save.bind(this);
        this.state = {
            person: {
                id: 0,
                shortName: "",
                firstName: "",
                secondName: "",
                sex: "",
                b_year: "",
                region: "",
                district: "",
                city: "",
                mobile: "",
                email: ""
            },
            stepIndex: 0,
            result: "",
            recom:"",
            trueQuestions:[],
            isResultReady: false,
            isAnonymously:false,
            personId:null
    }
        this.getStepContent = this.getStepContent.bind(this);
        this.changeAnonymously = this.changeAnonymously.bind(this);

    }
    
    save() {
        var regExp = new RegExp(/[\s\+\(\)]/g);
        this.state.person.mobile = this.state.person.mobile.replace(regExp, '').slice(3);
        var result = {
            answers: this.context.answers,
            person: this.state.person,
            lang: window.lang
        }
        this.setState({ result: "", isResultReady: false });
        axios.post("/api/dictionaries/send", result).then(response => {
            this.setState({ result: response.data.result, recom:response.data.recomId, trueQuestions:response.data.trueAnswers, isResultReady: true, personId:response.data.personId });
        });
    }
    changeField(name, val) {
        this.state.person[name] = val;
    }
    changeAnonymously(val) {
        var value = val;
        this.setState({ isAnonymously: value });
        if (value) {
            this.setState({ person: {
                id: 0,
                shortName: "",
                firstName: "",
                secondName: "",
                sex: "",
                b_year: "",
                region: "",
                district: "",
                city: "",
                mobile: "",
                email: ""
            } });
            this.setState({ stepIndex: this.state.stepIndex + 1 });
        }
    }
    componentDidMount(){}

    getStepContent(stepIndex) {
        switch (stepIndex) {
        case 0:
            return <form className="form-container">
                       <Questions answers={this.state.answers} person={this.state.person}/>
                   </form>;
        case 1:
            const resultControl = this.state.isResultReady
                ? <Result result={this.state.result} recomId={this.state.recom} trueQuestions={this.state.trueQuestions} personId={this.state.personId}/>
                : <div style={{ width: "100%", textAlign: "center" }}><CircularProgress style={circularStyle} color=
                                                                                        "#13bbaa" size={80}/>
                  </div>;
            return <div className="resultContainer">
                       {resultControl}
                   </div>;
            default:
                return '';
        }
    }
    handleNext() {
        let stepIndex = this.state.stepIndex;
        if (stepIndex === 0) {
            this.save();
        }
        stepIndex++;
        this.setState({ stepIndex });
    }
    getChildContext() {
        return {
            muiTheme: getMuiTheme(defaultTheme),
            myActions: this.props.myActions,
            regions: this.props.regions,
            questions: this.props.questions,
            answers: this.props.answers,
            resources: this.props.resources,
            districts:this.props.districts,
            cities:this.props.cities
        };
    }
    getStepIcon(step, stepIndex) {
        if (step >= stepIndex) {
            return <FontIcon className="material-stepper-icon" style={iconStyles}>{stepIndex + 1}</FontIcon>;
        } else {
            return <FontIcon className="disable-material-stepper-icon" style={iconStyles}>{stepIndex + 1}</FontIcon>;
        }
    }
    render() {
        const stepIndex = this.state.stepIndex;
        const labels = [I18n.t("questionnaire"), I18n.t("result")];
        return <div className="questionnaire-form">
                   <Paper zDepth={2} className="questionnaire-block">
                       <MuiThemeProvider muiTheme={muiTheme}>
                       <div style={{ marginLeft: 20, marginRight: 20, height:75}} className="stepper" >                            
                       </div>
                                                  </MuiThemeProvider>
                       {this.getStepContent(stepIndex)}

                   </Paper>
                   {stepIndex == 0 && <div style={{ marginTop: 12 }} className="stepper-btns buttonBlock">
                       <RaisedButton
                           label={stepIndex === 0 ? I18n.t("getResult") : I18n.t("next")}
                           disabled={stepIndex === 1}
                           style={{ height: 40, width: 210 }}
                           primary={true}
                           labelStyle={btnLabelStyle}
                           onTouchTap={this.handleNext.bind(this)}/>
                   </div>
}
                   
               </div>;
    }
}
MainFormBlock.contextTypes = {
    answers: PropTypes.array,
    districts: PropTypes.array
};
MainFormBlock.childContextTypes = {
    muiTheme: PropTypes.object.isRequired,
    regions: PropTypes.array,
    questions: PropTypes.array,
    myActions: PropTypes.object,
    districts: PropTypes.array,
    cities:PropTypes.array,
    answers: PropTypes.array,
    resources:PropTypes.object
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
export default connect(mapStateToProps, mapDispatchToProps)(MainFormBlock);

