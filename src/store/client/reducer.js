import {
    GET_CLIENT,
    LIST_CLIENT,
    SINGLE_CLIENT
} from "./actionTypes"

const INIT_STATE = {
    client: [],
    error: {},
    singleClient: null,
    isLoading: false,
}

const ClientRD = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LIST_CLIENT:
            return {
                ...state,
                client: action.payload,
                isLoading: false,
            }
        case SINGLE_CLIENT:
            return {
                ...state,
                singleClient: action.payload,
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

export default ClientRD
