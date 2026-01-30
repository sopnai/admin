import {
    LIST_NOTIFICATION,
} from "./actionTypes"

const INIT_STATE = {
    notification: [],
    error: {},
    isLoading: false,
}

const NotificationRD = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LIST_NOTIFICATION:
            return {
                ...state,
                notification: action.payload,
                isLoading: false,
            }
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            }
        default:
            return state
    }
}

export default NotificationRD
