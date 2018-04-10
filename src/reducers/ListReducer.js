import * as Actions from '../constants/lists';


export default function ListReducer(state = [], action) {
    switch (action.type) {
        case Actions.START_LOAD_LISTS: return {state: action.type, data: action.data || {}};
        case Actions.FINISH_LOAD_LISTS: return {state: action.type, data: action.data || {}};
        case Actions.ERROR_LOAD_LISTS: return {state: action.type, data: action.data || {}};

        case Actions.START_LOAD_ITEM_LISTS: return {state: action.type, data: action.data || {}};
        case Actions.FINISH_LOAD_ITEM_LISTS: return {state: action.type, data: action.data || {}};
        case Actions.ERROR_LOAD_ITEM_LISTS: return {state: action.type, data: action.data || {}};

        case Actions.START_REMOVE_ITEM_LISTS: return {state: action.type, data: action.data || {}};
        case Actions.FINISH_REMOVE_ITEM_LISTS: return {state: action.type, data: action.data || {}};
        case Actions.ERROR_REMOVE_ITEM_LISTS: return {state: action.type, data: action.data || {}};

        case Actions.START_UPDATE_ITEM_LISTS: return {state: action.type, data: action.data || {}};
        case Actions.FINISH_UPDATE_ITEM_LISTS: return {state: action.type, data: action.data || {}};
        case Actions.ERROR_UPDATE_ITEM_LISTS: return {state: action.type, data: action.data || {}};

        case Actions.START_ADD_ITEM_LISTS: return {state: action.type, data: action.data || {}};
        case Actions.FINISH_ADD_ITEM_LISTS: return {state: action.type, data: action.data || {}};
        case Actions.ERROR_ADD_ITEM_LISTS: return {state: action.type, data: action.data || {}};

        case Actions.START_UPDATE_LISTS: return {state: action.type, data: action.data || {}};
        case Actions.FINISH_UPDATE_LISTS: return {state: action.type, data: action.data || {}};
        case Actions.ERROR_UPDATE_LISTS: return {state: action.type, data: action.data || {}};

        default: return state;
    }
}