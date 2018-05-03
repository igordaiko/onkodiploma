//import request from 'superagent'
import axios from 'axios';
import browser from 'detect-browser';
import * as types from 'constants/ActionTypes';
import {Translate, I18n} from 'react-redux-i18n';
const hash = require('object-hash');
let  requestPull = [];
import URI  from 'urijs';
const lock = function(request) {
    let requestHashKey = hash(request.payload);
    let keyString = request.settings.actionType + requestHashKey;
    let requestExist = _.some(requestPull, { requestKey: keyString});
    console.log(keyString +"    -    " + requestExist);
    if (!requestExist) {
        requestPull.push({ requestKey: keyString });
        return true;
    }
    return false;
}

const unlock = function(request) {
    let requestHashKey = hash(request.payload);
    let keyString = request.settings.actionType + requestHashKey;
    _.remove(requestPull, { requestKey: keyString});
}
const dataService = store => next => action => {
   
   if (action.isLock == true && !lock(action)) return { ...store };
    next(action);
    switch (action.type) {
        case types.GET_REGIONS:
            {
                axios.get("api/dictionaries/regions").then(response => {
                    var resources = JSON.parse(response.data);
                    store.dispatch({ type: types.GET_REGIONS_RECIEVED, payload: resources });
                });
                break;
            }
        case types.GET_DISTRICTS:
            {
                axios.get("api/dictionaries/districts").then(response => {
                    var resources = JSON.parse(response.data);
                    store.dispatch({ type: types.GET_DISTRICTS_RECIEVED, payload: resources });
                });
                break;
            }
        case types.GET_CITIES:
            {
                axios.get("api/dictionaries/cities").then(response => {
                    var resources = JSON.parse(response.data);
                    store.dispatch({ type: types.GET_CITIES_RECIEVED, payload: resources });
                });
                break;
            }
        case types.GET_QUESTIONS:
        {
            axios.get("api/dictionaries/questions/").then(response => {
                var questions = JSON.parse(response.data);
                store.dispatch({ type: types.GET_QUESTIONS_RECIEVED, payload: questions });
            });
        }
    }

};

export default dataService