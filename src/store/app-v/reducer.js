import {
    LIST_APP_V,
} from "./actionTypes"

const INIT_STATE = {
    appV: [],
    error: {},
    isLoading: false,
}

const AppVRD = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LIST_APP_V:
            return {
                ...state,
                appV: action.payload,
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

export default AppVRD
