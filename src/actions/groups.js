import * as PlatfromActions from '../constants/groups';
import * as API from '../models/GroupModel';


export function loadList() {
    return {
        type: "PROMISE",
        actions: [
            PlatfromActions.START_LOAD_GROUPS,
            PlatfromActions.FINISH_LOAD_GROUPS,
            PlatfromActions.ERROR_LOAD_GROUPS,
        ],
        promise: API.loadList()
    }
}

export function loadInfo(id) {
    return {
        type: "PROMISE",
        actions: [
            PlatfromActions.START_LOAD_GROUP,
            PlatfromActions.FINISH_LOAD_GROUP,
            PlatfromActions.ERROR_LOAD_GROUP,
        ],
        promise: API.loadInfo(id)
    }
}

export function addGroup(data) {
    return {
        type: "PROMISE",
        actions: [
            PlatfromActions.START_ADD_GROUP,
            PlatfromActions.FINISH_ADD_GROUP,
            PlatfromActions.ERROR_ADD_GROUP,
        ],
        promise: API.addGroup(data)
    }
}

export function updateGroup(id, data) {
    return {
        type: "PROMISE",
        actions: [
            PlatfromActions.START_UPDATE_GROUP,
            PlatfromActions.FINISH_UPDATE_GROUP,
            PlatfromActions.ERROR_UPDATE_GROUP,
        ],
        promise: API.updateGroup(id, data)
    }
}

export function removeGroup(id) {
    return {
        type: "PROMISE",
        actions: [
            PlatfromActions.START_REMOVE_GROUP,
            PlatfromActions.FINISH_REMOVE_GROUP,
            PlatfromActions.ERROR_REMOVE_GROUP,
        ],
        promise: API.deleteGroup(id)
    }
}