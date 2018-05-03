import * as types from '../constants/ActionTypes';
export function getRegions() {
    return function(dispatch) {
        dispatch({
            type: 'GET_REGIONS'
        });
    }
}
export function getDistricts(id) {
    return function(dispatch) {
        dispatch({
            type: 'GET_DISTRICTS'
        });
    }
}
export function getCities() {
    return function(dispatch) {
        dispatch({
            type: 'GET_CITIES'
        });
    }
}
export function getQuestions(lang) {
    return function(dispatch) {
        dispatch({
            type: 'GET_QUESTIONS',
            payload: {lang: lang}
        });
    }
}

export function setDefaultAnswers() {
    return function(dispatch) {
        dispatch({
            type: 'SET_DEFAULT_ANSWERS'
        });
    }
}
export function setAnswer(questionId, answer) {
    return function(dispatch) {
        dispatch({
            type: 'SET_ANSWER',
            payload: { questionId: questionId, answer: answer }
        });
    }
}
