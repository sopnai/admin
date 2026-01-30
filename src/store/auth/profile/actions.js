import {
    PROFILE_ERROR,
    PROFILE_SUCCESS,
    EDIT_PROFILE,
    RESET_PROFILE_FLAG,
    GET_PROFILE,
    LIST_PROFILE,
} from "./actionTypes"

export const setLoadingProfile = (isLoading) => ({
    type: 'SET_LOADING',
    payload: isLoading,
});

export const getProfiles = (payload) => ({
    type: GET_PROFILE,
    payload: payload,
})

export const listProfile = (payload) => ({
    type: LIST_PROFILE,
    payload: payload,
})

export const editProfile = user => {
    return {
        type: EDIT_PROFILE,
        payload: { user },
    }
}

export const profileSuccess = msg => {
    return {
        type: PROFILE_SUCCESS,
        payload: msg,
    }
}

export const profileError = error => {
    return {
        type: PROFILE_ERROR,
        payload: error,
    }
}

export const resetProfileFlag = error => {
    return {
        type: RESET_PROFILE_FLAG,
    }
}
