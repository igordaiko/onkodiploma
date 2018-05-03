import {combineReducers} from 'redux'
import contentReducer from './contentReducer'
import { loadTranslations, setLocale, syncTranslationWithStore, i18nReducer } from 'react-redux-i18n';


export default combineReducers({
    contentReducer,
    i18n: i18nReducer
});

