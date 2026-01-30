import {
    LOGIN_USER,
    LOGIN_SUCCESS,
    LOGOUT_USER,
    LOGOUT_USER_SUCCESS,
    API_ERROR,
} from "./actionTypes"

import { getMobileProfile, updateForgotPassword } from "helpers/Module"

export const loginUser = (user, history) => {
    return {
        type: LOGIN_USER,
        payload: { user, history },
    }
}

export const loginSuccess = user => {
    return {
        type: LOGIN_SUCCESS,
        payload: user,
    }
}

export const logoutUser = history => {
    return {
        type: LOGOUT_USER,
        payload: { history },
    }
}

export const logoutUserSuccess = () => {
    return {
        type: LOGOUT_USER_SUCCESS,
        payload: {},
    }
}

export const apiError = error => {
    return {
        type: API_ERROR,
        payload: error,
    }
}

export const getMobileProfileAction = (payload) => { return getMobileProfile(payload); }

export const updateForgotPasswordAction = (payload) => { return updateForgotPassword(payload); }
