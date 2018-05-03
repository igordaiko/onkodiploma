import * as types from '../constants/ActionTypes';
import {connect} from 'react-redux';
import _ from 'lodash';
const initialViewStateContent = {
    content: { pageCache: [] },
    resources: {},
    regionsLoading: false,
    districtsLoading: false,
    questionsLoading: false,
    regions: [],
    districts: [],
    cities:[],
    questions: [],
    answers:[]
}

export default function contentReducer(state = initialViewStateContent, action) {
    switch (action.type) {
        case types.SET_RESOURCES:
        {
            let nextStore = _.cloneDeep(state);
            nextStore.resources = action.payload;
            return nextStore;
        }
        case types.GET_REGIONS:
        {
            let nextStore = _.cloneDeep(state);
            nextStore.regionsLoading = true;

            return nextStore;
        }
        case types.GET_REGIONS_RECIEVED:
            {
                let nextStore = _.cloneDeep(state);
                nextStore.regionsLoading = false;
                nextStore.regions = action.payload;

                return nextStore;
            }
        case types.GET_DISTRICTS:
            {
                let nextStore = _.cloneDeep(state);
                nextStore.districtsLoading = true;

                return nextStore;
            }
        case types.GET_DISTRICTS_RECIEVED:
            {
                let nextStore = _.cloneDeep(state);
                nextStore.districtsLoading = false;
                nextStore.districts = action.payload;
                return nextStore;
            }
        case types.GET_CITIES:
            {
                let nextStore = _.cloneDeep(state);
                nextStore.districtsLoading = true;

                return nextStore;
            }
        case types.GET_CITIES_RECIEVED:
            {
                let nextStore = _.cloneDeep(state);
                nextStore.districtsLoading = false;
                nextStore.cities = action.payload;
                return nextStore;
            }
        case types.GET_QUESTIONS:
            {
                let nextStore = _.cloneDeep(state);
                nextStore.questionsLoading = true;
                return nextStore;
            }
        case types.GET_QUESTIONS_RECIEVED:
            {
                let nextStore = _.cloneDeep(state);
                nextStore.questionsLoading = false;
                nextStore.questions = action.payload;
                if (nextStore.questions.length > 0) {
                    let changeObj = {};
                    changeObj.answers = [];
                    _.each(nextStore.questions,
                        function(q) {
                            changeObj.answers.push({
                                question: q.Id,
                                person: 0,
                                answer:0,
                                questionnaire: q.Questionaire
                            });

                        });
                    nextStore.answers = changeObj.answers;
                }
                return nextStore;
            }
        case types.SET_DEFAULT_ANSWERS:
            {
                let nextStore = _.cloneDeep(state);
                if (nextStore.questions.length > 0) {
                    let changeObj = {};
                    changeObj.answers = [];
                    _.each(nextStore.questions,
                        function(q) {
                            changeObj.answers.push({
                                question: q.Id,
                                person: 0,
                                answer:0
                            });

                        });
                    nextStore.answers = changeObj.answers;   
                }
                return nextStore;
            }
        case types.SET_ANSWER:
        {
                let nextStore = _.cloneDeep(state);
                let question = action.payload.questionId;
                let answer = action.payload.answer;
                _.find(nextStore.answers,
                    function(a) {
                        if (a.question === question) {
                            a.answer = (Number)(answer);
                        }
                    });
                return nextStore;
            } 
        default: 
            return {...state};
    }
}
