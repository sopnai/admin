import {
    GET_DASHBOARD,
    LIST_DASHBOARD
} from "./actionTypes"

const INIT_STATE = {
    dashboard: [],
    error: {},
    isLoading: false,
}

const DashboardRD = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LIST_DASHBOARD:
            return {
                ...state,
                dashboard: action.payload,
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

export default DashboardRD
