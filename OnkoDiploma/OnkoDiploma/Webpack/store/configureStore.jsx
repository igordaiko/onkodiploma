import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import axios from 'axios';
import * as types from 'constants/ActionTypes';
import { loadTranslations, setLocale, syncTranslationWithStore, i18nReducer } from 'react-redux-i18n';
import dataService from 'dataSource/dataSource';

export default function configureStore(initialState) {
   
    const store = createStore(
        rootReducer ,
        initialState,
        compose(applyMiddleware(thunk,  dataService),  window.devToolsExtension ? window.devToolsExtension() : f => f)); 

   
    if (module.hot) {
        module.hot.accept('../reducers',
            () => {
                const nextRootReducer = require('../reducers');
                store.replaceReducer(nextRootReducer);
            });
    }

    syncTranslationWithStore(store);
   

    var translations;//= localStorage.getItem("reactTranslations_" + 'ukr');
    
    if (translations) {
        store.dispatch(setLocale('ukr'));
        var json = JSON.parse(translations)
        store.dispatch(loadTranslations(json));
        store.dispatch({ type: types.SET_RESOURCES, payload: json });
    }else{
        axios.get("api/dictionaries/localization")
            .then(function(response) {
                var resources = JSON.parse(response.data);
                // localStorage.setItem("reactTranslations_" + 'ukr', JSON.stringify(resources));
                let lang = window.lang == 2 ? "rus" : "ukr";
                store.dispatch(setLocale(lang));
                store.dispatch(loadTranslations(resources));
                
                store.dispatch({ type: types.SET_RESOURCES, payload: resources });
            }).catch(function(error) {
                console.log(">>> error loading translations <<<");
            });
    }
    
   
    return store;
}