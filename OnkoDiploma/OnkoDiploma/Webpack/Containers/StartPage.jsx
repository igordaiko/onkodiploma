import React, { Component } from 'react';
import {Translate, I18n} from 'react-redux-i18n';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import defaultTheme from 'theme/Themes';
import PropTypes from 'prop-types';
import Question from 'Containers/Question'
import _ from 'lodash';
import Recaptcha from 'react-recaptcha';
import { Link } from 'react-router';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
const styles = {
    infolabel: {
        display: "block",
        width: "100%"
    },
    checkboxLabelStyle: {
        fontSize: "24px",
        width: "auto"
    },
    overlayStyle: {
        background: "inherit",
        height: "50px",
        borderRadius: 5
    },
    buttonStyle: {
        lineHeight: "50px"
    },
    buttonLabelStyle: {
        fontSize: 20,
        color: "white",
        fontWeight:900
    },
    checkBoxStyle: {
        background:"#fff"
    }
};
export default class StartPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAgree: false,
            isVerified: false
    }

    }
    verifyCallback(response) {
        if(response)
        this.setState({ isVerified: true });
    }
    componentDidMount() {
    }
   
    
    render() {
        return <div className="main-block">
                   <div className="header">
                                              <span>{I18n.t('startPage.questionnaireTitle')}</span>

                   </div>
                   <div className="title">
                       <span className="h1">{I18n.t('startPage.label1')}</span>
                       <span>{I18n.t("startPage.header1")}</span>

                        <span>{I18n.t("startPage.header2")}</span>

                   </div>
                   <div className="confimation">
                       <span className="h2">{I18n.t('startPage.label2')}</span>
                       <span className="link h3">{I18n.t('startPage.infoLink1')}</span>
                       <span className="link h3">{I18n.t('startPage.infoLink2')}</span>
                       <div className="checkbox-block">
                           <Checkbox
                               label={I18n.t("agreeWithRules")}
                               checked={this.state.isAgree}
                               labelStyle={styles.checkboxLabelStyle}
                               iconStyle={styles.checkBoxStyle}
                               onCheck={(res, value) => this.setState({ isAgree: value })}
                               labelPosition="left"
                               style={styles.checkbox}/>

                       </div>
                       <div className="buttonBlock">
                       <Recaptcha sitekey="6Lc8AywUAAAAAN5Vc3uQ1xNlN-VkS-tk7uRV_hMX" onloadCallback={this.verifyCallback.bind(this)} verifyCallback={this.verifyCallback.bind(this)} render="explicit"/>
                       </div>
                       <div className="buttonBlock">
                           <RaisedButton label={I18n.t("startPage.fillQuestionnaire")} 
                           disabled={!(this.state.isAgree) || !(this.state.isVerified)} style={styles.overlayStyle} overlayStyle={styles.overlayStyle} labelStyle={styles.buttonLabelStyle} buttonStyle={styles.buttonStyle} 
                           onClick={() => { this.props.history.push('/form') }}/>
                       </div>
                   </div>

               </div>;
    }
   
}

