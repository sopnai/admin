import {
    GET_APP_V,
    LIST_APP_V,
} from "./actionTypes"


export const setLoadingAppV = (isLoading) => ({
    type: 'SET_LOADING',
    payload: isLoading,
});

export const getAppV = (payload) => ({
    type: GET_APP_V,
    payload: payload,
})

export const listAppV = (payload) => ({
    type: LIST_APP_V,
    payload: payload,
})

