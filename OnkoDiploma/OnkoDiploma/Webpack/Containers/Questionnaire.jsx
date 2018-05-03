import React, { Component } from 'react';
import {Translate, I18n} from 'react-redux-i18n';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import defaultTheme from 'theme/Themes';
import PropTypes from 'prop-types';
import AutoComplete from 'material-ui/AutoComplete';
import CircularProgress from 'material-ui/CircularProgress';
import axios from 'axios';
import _ from 'lodash';
import MaskedInput from 'react-maskedinput';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const menuStyle = {
    height:300,
    overflow:"auto",
    background:"#fff",
    width:"100%"
}
const textFieldStyleForAutocomlete = {
    paddingLeft: 5,
    background:"#fff",
    height:34,
    cursor:"pointer",
    width:"100%"
}
const circularStyle = {
    marginTop: 10
}
const textFieldStyle = {
    height:34,
    lineHeight:"34px",
    paddingLeft:5,
top:0
}
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

  
export default class Questionnaire extends Component {
      constructor(props) {
          super(props);
          this.state = {
              person:this.props.person,
              districtSearchText: "",
              citiesSearchText: "s",
              cities:[],
              year:"",
              mobile:"",
              sex:null,
              districts:[],
              request: {
                  regionId: null,
                  districtId: null
              }
          }
          this.state.person = props.person;
          this.handleRegionChanged = this.handleRegionChanged.bind(this);
          this.handleDistrictChanged = this.handleDistrictChanged.bind(this);
          this.handleCityChanged = this.handleCityChanged.bind(this);
          this.handleFieldChange = this.handleFieldChange.bind(this);
          this.handleSexChange = this.handleSexChange.bind(this);
          this.getDistricts = this.getDistricts.bind(this);
          this.getCities = this.getCities.bind(this);

      }

      componentDidMount() {
      }

      handleRegionChanged(region) {
          var id = region.Id;
          var regionName = region.Name;
          this.props.onChange("region", id);
          this.props.onChange("district", "");
          this.setState({districtSearchText:''});
          this.setState({
              cities: [],
              districtLoading: true
          });
          this.getDistricts(id);
      }
      handleDistrictChanged(district) {
          var id = district.Id;
          var districtName = district.Name;
          this.setState({districtSearchText: districtName});
          var districtType = _.find(this.state.districts, function(d) { return d.Id === id}).Type;
          var propName = districtType === 0 ? "district" : "city";
          this.props.onChange(propName, id);
          if(districtType === 0) 
              this.props.onChange("city", "");
          this.setState({
              citySearchText:'',
              cityLoading: true
          });
          this.getCities(id);
      } 
      handleCityChanged(city) {
          var id = city.Id;
          var cityName = city.Name;
          this.setState({ citySearchText: cityName });
          this.props.onChange("city", id);
      }
      handleSexChange(event, index, value) {
          let val = value;
          this.setState({ sex: val });
          this.props.onChange("sex", value);
      }
      handleFieldChange(event) {
          var val = event.target.value;
          var name = event.target.name;
          if (name === "b_year") {
              this.setState({ year: val });
          }
          if (name === "mobile") {
              this.setState({ mobile: val });
          }
          this.props.onChange(name, val);
      }  

      componentWillUpdate(nextProps, nextState) {

      }
      componentWillReceiveProps(nextProps, nextContext) {
          if (this.context.questions.length > 0) {
              var pageCount = this.context.questions.length / 10;
              this.setState({
                  pageCount: pageCount,
                  questionsToPage: this.context.questions.slice(this.state.page*10, this.state.page*10+10),
                  itemsCount: this.context.questions.length
              });
          }
      }

      getDistricts(id) {
          var districts = _.filter(this.context.districts,
              function(d) {
                  return d.ParentId == id;
              });
          districts = _.sortBy(districts,
              function(d) {
                  return !d.Type;
              });
          this.setState({ districts: districts, districtLoading: false });
      }
      getCities(id) {
          var cities = _.filter(this.context.cities,
              function(d) {
                  return d.ParentId == id;
              });
          this.setState({ cities: cities, cityLoading: false });
      }
      render() {
          const DistrictsControl = this.state.districts.length > 0?
                    <div className="col-md-4">
                        <AutoComplete searchText={this.state.districtSearchText}
                                      onNewRequest={this.handleDistrictChanged}
                                      dataSource={this.state.districts}
                                      openOnFocus={true}
                                      name="district"
                                      dataSourceConfig={{ text: "Name", value:'Id' }}
                                      filter={AutoComplete.caseInsensitiveFilter}
                                      textFieldStyle={textFieldStyleForAutocomlete}
                                      menuStyle={menuStyle}
                                      className="form-control"
                                      fullWidth={true}
                                      floatingLabelText={I18n.t("district")}
                                      floatingLabelFocusStyle={styles.LabelStyle} 
                                      floatingLabelShrinkStyle={styles.LabelStyle} 
                                      style={styles.textArea}
                                      />
                    </div>
              : this.state.districtLoading ? <div><CircularProgress style={circularStyle}/></div>:<span></span>;

          const CitiesControl = this.state.cities.length > 0
              ? <div className="col-md-4">
                                <AutoComplete searchText={this.state.citiesSerchText}
                                              name="city"
                                              onNewRequest={this.handleCityChanged}
                                              dataSource={this.state.cities}
                                              openOnFocus={true}
                                              dataSourceConfig={{ text: "Name", value: 'Id' }}
                                              filter={AutoComplete.caseInsensitiveFilter}
                                              textFieldStyle={textFieldStyleForAutocomlete}
                                              menuStyle={menuStyle}
                                              className="form-control"
                                              fullWidth={true}
                                              floatingLabelText={I18n.t("city")}
                                              floatingLabelFocusStyle={styles.LabelStyle} 
                                              floatingLabelShrinkStyle={styles.LabelStyle} 
                                             />
                               </div>
              : this.state.cityLoading ? <div><CircularProgress style={circularStyle}/></div>:<span></span>;

          return (<div className="form-container" style={{width:"100%"}}>
                      
                      <div className="form-group">
                          <div className="col-md-4">
                              <TextField floatingLabelText={I18n.t("shortName")} inputStyle={styles
                                  .textArea} floatingLabelFocusStyle={styles
                                      .LabelStyle} floatingLabelShrinkStyle={styles
                                          .LabelStyle} type="text" className="form-control" name="shortName" onChange={
this
    .handleFieldChange}/>
                          </div>
                          <div className="col-md-4">
                              <TextField floatingLabelText={I18n.t("firstName")} inputStyle={styles
                                  .textArea} floatingLabelFocusStyle={styles
                                      .LabelStyle} floatingLabelShrinkStyle={styles
                                          .LabelStyle} type="text" className="form-control" name="firstName" onChange={
this
    .handleFieldChange}/>
                          </div>
                          <div className="col-md-4">
                              <TextField floatingLabelText={I18n.t("secondName")} inputStyle={styles
                                  .textArea} floatingLabelFocusStyle={styles
                                      .LabelStyle} floatingLabelShrinkStyle={styles
                                          .LabelStyle} type="text" className="form-control" name="secondName" onChange=
                                         {
this
    .handleFieldChange}/>
                          </div>
                      </div>
                      <div className="form-group">
                          <div className="col-md-4">
                              <SelectField className="form-control"
                                           floatingLabelText={I18n.t("sex.label")}
                                           floatingLabelFocusStyle={styles.LabelStyle}
                                           floatingLabelShrinkStyle={styles.LabelStyle}
                                           value={this.state.sex}
                                           labelStyle={textFieldStyle}
                                           onChange={this.handleSexChange}
                                           name="sex"
                                           iconStyle={styles.iconStyle}>
                                  <MenuItem value={0} primaryText={I18n.t("sex.man")}/>
                                  <MenuItem value={1} primaryText={I18n.t("sex.woman")}/>
                              </SelectField>
                          </div>
                          <div className="col-md-4">
                              <TextField floatingLabelText={I18n.t("year")} floatingLabelFocusStyle={styles
                                  .LabelStyle} inputStyle={styles
                                      .textArea} floatingLabelFixed={this.state.year.length > 0} className=
                                         "form-control" floatingLabelShrinkStyle={styles.LabelStyle}>
                                  <MaskedInput mask="1111" name="b_year" className="form-control" placeholder="" type=
                                               "text" onChange={this.handleFieldChange}/>
                              </TextField>
                          </div>

                      </div>
                      <div className="place-fields form-group">
                          <div className="col-md-4">
                              <AutoComplete className="form-control input-material"
                                            searchText={this.state.searchText}
                                            onNewRequest={this.handleRegionChanged}
                                            dataSource={this.context.regions}
                                            name="region"
                                            openOnFocus={true}
                                            dataSourceConfig={{ text: "Name", value: 'Id' }}
                                            filter={AutoComplete.caseInsensitiveFilter}
                                            menuStyle={menuStyle}
                                            fullWidth={true}
                                            floatingLabelText={I18n.t("region")}
                                            floatingLabelFocusStyle={styles.LabelStyle}
                                            floatingLabelShrinkStyle={styles.LabelStyle}
                                            style={styles.textArea}/>
                          </div>
                          {DistrictsControl}
                          {CitiesControl}

                      </div>
                      <div className="form-group">
                          <div className="col-md-4">
                              <TextField floatingLabelText={I18n
                                  .t("mobile")} floatingLabelStyle={{ display: "none" }} floatingLabelFocusStyle={styles
                                      .LabelStyle} floatingLabelFixed={true} floatingLabelShrinkStyle={styles
                                          .LabelStyle} className="form-control">
                                  <MaskedInput mask="+38(011)111 111 11" name="mobile" className="form-control"
                                               placeholder="+38(0__)___ __ __" onChange={this.handleFieldChange}/>
                              </TextField>
                          </div>
                          <div className="col-md-4">
                              <TextField floatingLabelText={I18n.t("email")} inputStyle={styles
                                  .textArea} floatingLabelFocusStyle={styles
                                      .LabelStyle} type="text" className="form-control" name="email" onChange={this
                                          .handleFieldChange}/>
                          </div>
                      </div>
                  </div>);

      }
   
}

Questionnaire.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    regions: PropTypes.array,
    myActions: PropTypes.object,
    questions: PropTypes.array,
    districts: PropTypes.array,
    cities: PropTypes.array,
    resources: PropTypes.object
};