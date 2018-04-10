import * as Actions from '../constants/translations';
// поменять константы

export default function TranslationReducer(state = [], action) {
    switch (action.type) {
        case Actions.START_LOAD_LANGS: return {state: action.type, data: action.data || {}};
        case Actions.FINISH_LOAD_LANGS: return {state: action.type, data: action.data || {}};
        case Actions.ERROR_LOAD_LANGS: return {state: action.type, data: action.data || {}};

        case Actions.START_DELETE_LANG: return {state: action.type, data: action.data || {}};
        case Actions.FINISH_DELETE_LANG: return {state: action.type, data: action.data || {}};
        case Actions.ERROR_DELETE_LANG: return {state: action.type, data: action.data || {}};

        case Actions.START_ADD_LANG: return {state: action.type, data: action.data || {}};
        case Actions.FINISH_ADD_LANG: return {state: action.type, data: action.data || {}};
        case Actions.ERROR_ADD_LANG: return {state: action.type, data: action.data || {}};

        case Actions.START_UPDATE_LANG: return {state: action.type, data: action.data || {}};
        case Actions.FINISH_UPDATE_LANG: return {state: action.type, data: action.data || {}};
        case Actions.ERROR_UPDATE_LANG: return {state: action.type, data: action.data || {}};

        case Actions.START_LOAD_PHS: return {state: action.type, data: action.data || {}};
        case Actions.FINISH_LOAD_PHS: return {state: action.type, data: action.data || {}};
        case Actions.ERROR_LOAD_PHS: return {state: action.type, data: action.data || {}};

        case Actions.START_UPDATE_PH: return {state: action.type, data: action.data || {}};
        case Actions.FINISH_UPDATE_PH: return {state: action.type, data: action.data || {}};
        case Actions.ERROR_UPDATE_PH: return {state: action.type, data: action.data || {}};

        default: return state;
    }
}