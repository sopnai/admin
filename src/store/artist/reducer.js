import {
    GET_ARTIST,
    LIST_ARTIST,
    SINGLE_ARTIST
} from "./actionTypes"

const INIT_STATE = {
    artist: [],
    error: {},
    singleart: null,
    isLoading: false,
}

const ArtistRD = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LIST_ARTIST:
            return {
                ...state,
                artist: action.payload,
                isLoading: false,
            }
        case SINGLE_ARTIST:
            return {
                ...state,
                singleart: action.payload,
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

export default ArtistRD
