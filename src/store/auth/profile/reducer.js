import { PROFILE_ERROR, PROFILE_SUCCESS, EDIT_PROFILE, RESET_PROFILE_FLAG, GET_PROFILE, LIST_PROFILE } from "./actionTypes"

const initialState = {
    profile: [],
    error: "",
    success: "",
}

const profile = (state = initialState, action) => {
    switch (action.type) {
        case LIST_PROFILE:
            return {
                ...state,
                profile: action.payload.data,
                isLoading: false,
            }
        case EDIT_PROFILE:
            state = { ...state }
            break
        case PROFILE_SUCCESS:
            state = { ...state, success: action.payload }
            break
        case PROFILE_ERROR:
            state = { ...state, error: action.payload }
            break
        case RESET_PROFILE_FLAG:
            state = { ...state, success: null }
            break
        default:
            state = { ...state }
            break
    }
    return state
}

export default profile
