import React, { Component } from 'react';
import {Translate, I18n} from 'react-redux-i18n';
import _ from 'lodash';
import { Link } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import NumericInput from 'react-numeric-input';
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
import PdfManager from 'Managers/PdfManager';

import axios from 'axios';

const styles= {
    floatingLabelStyle: {
        position: "absolute",
        lineHeight: 22,
        top: 38,
        transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
        zIndex: 1,
        transform: "scale(1) translate(0px, 0px)",
        transformOrigin: "left top 0px",
        pointerEvents: "none",
        userSelect: "none",
        color: "#fff",

    },
    LabelStyle: {
        color:"#000",
        display:"block"
    },
    textArea: {
        width: "100%",
        cursor:"pointer"
    },
    iconStyle: {
        padding:5,
        top:0,
        height:31,
        width:31,
        fill:"#13bbaa",
        borderRadius:"0",
        background:"#fff"
    },
    
}
const btnLabelStyle = {
    fontSize: 30
};

export default class Result extends Component {
    constructor(props) {
        super(props);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.print = this.print.bind(this);
        this.save = this.save.bind(this);
        this.state = {
            result: "",
            recom: 0,
            trueQuestions: [],
            personId:null,
            person: {
                name: "",
                shortName: "",
                secondName: "",
                age: "",
            },
            pdfManager: new PdfManager()
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.result && nextProps.result != "")
            this.setState({ result: nextProps.result });
        if (nextProps.recomId)
            this.setState({ recom: nextProps.recomId });
        if (nextProps.trueQuestions)
            this.setState({ trueQuestions: nextProps.trueQuestions });
        if (nextProps.personId)
            this.setState({ personId: nextProps.personId });

    }
    componentDidMount() {
        if (this.props.result && this.props.result != "")
            this.setState({ result: this.props.result });
        if (this.props.recomId)
            this.setState({ recom: this.props.recomId });
        if (this.props.trueQuestions)
            this.setState({ trueQuestions: this.props.trueQuestions });
        if (this.props.personId)
            this.setState({ personId: this.props.personId });

    }
    handleFieldChange(event) {
        var val = event.target.value;
        var name = event.target.name;
        let person = _.cloneDeep(this.state.person);
        person[name] = val;
        this.setState({ person });
    }  
    print() {
        axios.post("/api/dictionaries/setFileSaving", { PersonId: this.state.personId });
            window.pdfMake.vfs = pdfFonts.pdfMake.vfs;
            let person = {
                Name: this.state.person.shortName + " " + this.state.person.name + " " + this.state.person.secondName,
                age: this.state.person.age,
                trueQuestions: this.state.trueQuestions
            }
            var docDefinition = this.state.pdfManager.createPdf(person);
            pdfMake.createPdf(docDefinition).print();


    }
    save() {
        window.pdfMake.vfs = pdfFonts.pdfMake.vfs;
        let person = {
            Name: this.state.person.shortName + " " + this.state.person.name + " " + this.state.person.secondName,
            age: this.state.person.age,
            trueQuestions: this.state.trueQuestions
        }
        var docDefinition = this.state.pdfManager.createPdf(person);
        axios.post("/api/dictionaries/setFileSaving", {PersonId:this.state.personId});
        pdfMake.createPdf(docDefinition).download();

    }
    render() {
        let person = _.cloneDeep(this.state.person);
        let disableButtons = person.name == "" ||
            person.secondName == "" ||
            person.shortName == "" ||
            person.age == "";
        return <div className="result-block">
                   <div>
                       {this.state.result.split("\n").map((i, key) => { return <div key={key}>{i}</div>; })}
                   </div>
                   {this.state.recom == 2 &&
                       <div className="form-container">
                           <div className="formInputs">
                           <TextField floatingLabelText={I18n.t("shortName") + "*"}
                                      inputStyle={styles.textArea}
                                      floatingLabelFocusStyle={styles.LabelStyle}
                                      floatingLabelShrinkStyle={styles.LabelStyle}
                                      type="text"
                                      className="form-control"
                                      name="shortName"
                                      onChange={this.handleFieldChange}/>
                           <TextField floatingLabelText={I18n.t("firstName") + "*"}
                                      inputStyle={styles.textArea}
                                      floatingLabelFocusStyle={styles.LabelStyle}
                                      floatingLabelShrinkStyle={styles.LabelStyle}
                                      type="text"
                                      className="form-control"
                                      name="name"
                                      onChange={this.handleFieldChange}/>
                           <TextField floatingLabelText={I18n.t("secondName") + "*"}
                                      inputStyle={styles.textArea}
                                      floatingLabelFocusStyle={styles.LabelStyle}
                                      floatingLabelShrinkStyle={styles.LabelStyle}
                                      type="text"
                                      className="form-control"
                                      name="secondName"
                                      onChange={this.handleFieldChange}/>
                           <TextField floatingLabelText={I18n.t("age") + "*"}
                                      style={{flex: "0 0 100px"}}
                                      inputStyle={styles.textArea}
                                      floatingLabelFocusStyle={styles.LabelStyle}
                                      floatingLabelShrinkStyle={styles.LabelStyle}
                                      type="number"
                                      className="form-control"
                                      name="age"
                                      onChange={this.handleFieldChange}/>
                            </div>
                           <div className="buttonPanel">
                               <RaisedButton
                                   label={I18n.t("print")}
                                   disabled={disableButtons}
                                   style={{ height: 40, width: 210 }}
                                   primary={true}
                                   labelStyle={btnLabelStyle}
                                   onTouchTap={this.print}/>
                               <RaisedButton
                                   label={I18n.t("save")}
                                   disabled={disableButtons}
                                   style={{ height: 40, width: 210 }}
                                   primary={true}
                                   labelStyle={btnLabelStyle}
                                   onTouchTap={this.save}/>

                           </div>
                       </div>

                   }
               </div>;
    }
   
}

