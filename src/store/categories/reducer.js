import {
    GET_CAT,
    LIST_CAT,
} from "./actionTypes"

const INIT_STATE = {
    categories: {}, // Store multiple categories
    error: {},
    isLoading: false,
};

const CatRD = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LIST_CAT:
            return {
                ...state,
                categories: {
                    ...state.categories,
                    [action.payload.categoryId]: action.payload.data, // Store data per categoryId
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

export default CatRD;

