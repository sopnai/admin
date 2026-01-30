import {
    GET_CAT,
    LIST_SUBS,
} from "./actionTypes"

const INIT_STATE = {
    subServ: {},
    error: {},
    isLoading: false,
};

const SubServRD = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LIST_SUBS:
            return {
                ...state,
                subServ: {
                    ...state.subServ,
                    [action.payload.servId]: action.payload.data,
                },
                isLoading: false,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        default:
            return state;
    }
};

export default SubServRD;


