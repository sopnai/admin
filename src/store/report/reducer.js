import {
    GET_REPORT,
    LIST_REPORT,
    SINGLE_REPORT
} from "./actionTypes"

const INIT_STATE = {
    report: [],
    error: {},
    singleReport: null,
    isLoading: false,
}

const ReportRD = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LIST_REPORT:
            return {
                ...state,
                report: action.payload,
                isLoading: false,
            }
        case SINGLE_REPORT:
            return {
                ...state,
                singleReport: action.payload,
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

export default ReportRD
