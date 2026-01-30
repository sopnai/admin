import {
    LIST_ARTISTLVL,
} from "./actionTypes"

const INIT_STATE = {
    artistLvl: [],
    error: {},
    isLoading: false,
}

const ArtistLvlRD = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LIST_ARTISTLVL:
            return {
                ...state,
                artistLvl: action.payload,
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

export default ArtistLvlRD
