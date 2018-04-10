import * as Actions from '../constants/notifications';


export default function NotificationReducer(state = [], action) {
    switch(action.type) {
        case Actions.START_LOAD_NOTIFICATIONS: return {state: action.type, data: action.data || {}};
        case Actions.FINISH_LOAD_NOTIFICATIONS: return {state: action.type, data: action.data || {}};
        case Actions.ERROR_LOAD_NOTIFICATIONS: return {state: action.type, data: action.data || {}};

        case Actions.START_UPDATE_NOTIFICATIONS: return {state: action.type, data: action.data || {}};
        case Actions.FINISH_UPDATE_NOTIFICATIONS: return {state: action.type, data: action.data || {}};
        case Actions.ERROR_UPDATE_NOTIFICATIONS: return {state: action.type, data: action.data || {}};

        case Actions.START_LOAD_NOTIFICATION_TEMPLATE: return {state: action.type, data: action.data || {}};
        case Actions.FINISH_LOAD_NOTIFICATION_TEMPLATE: return {state: action.type, data: action.data || {}};
        case Actions.ERROR_LOAD_NOTIFICATION_TEMPLATE: return {state: action.type, data: action.data || {}};

        default: return state;
    }
}