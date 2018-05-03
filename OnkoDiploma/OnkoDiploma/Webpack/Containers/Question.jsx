import React, { Component } from 'react';
import {Translate, I18n} from 'react-redux-i18n';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux'

//actions
import * as actions from 'actions/contentActions'
const styles = {
    block: {
        maxWidth: 250,
    },
    radioButton: {
        marginBottom: 16,
        width: "auto"
    }
};
export class Question extends Component {
    constructor(props) {
        super(props);
        this.changeAnswer = this.changeAnswer.bind(this);
        this.getAnswer = this.getAnswer.bind(this);
    }

    componentDidMount() {
    }

    changeAnswer(event) {
        var answer = event.target.value
        var question = this.props.question.Id;
        this.props.myActions.setAnswer(question, answer);
    }
    getAnswer(id) {
        var value = _.find(this.props.answers,
            function(a) {
                return a.question == id;
            });

        return (Number)(value.answer);
    }

    render() {
        return <div className="question-block">
                   <label className="question-title" style={{color: '#000'}}>{this.props.questionNumber + ". " +this.props.question.Title}</label>
                   <RadioButtonGroup name={"question-" + this.props.question.Id}  valueSelected={this.getAnswer(this.props.question.Id)} className="radio-group" onChange={this.changeAnswer}>
                       <RadioButton value={0}
                                    label={I18n.t("no")}
                                    style={styles.radioButton} 
                                    iconStyle={{fill: '#000'}}
                                    labelStyle={{color: '#000'}}
                                    className="col-md-4, radio-inline"/>
                       <RadioButton value={1}
                                    label={I18n.t("yes")}
                                    style={styles.radioButton}
                                    iconStyle={{fill: '#000'}}
                                    labelStyle={{color: '#000'}}
                                    className="col-md-4 radio-inline"/>
                   </RadioButtonGroup>

        </div>;
    }

}
Question.contextTypes = {
    answers: PropTypes.array,
};
function mapStateToProps(state) {
    return {
        answers: state.contentReducer.answers
    }
}

function mapDispatchToProps(dispatch) {return {
    myActions: bindActionCreators(actions, dispatch)
}}
export default connect(mapStateToProps, mapDispatchToProps)(Question);


