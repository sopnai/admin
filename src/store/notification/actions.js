import {
    GET_NOTIFICATION,
    LIST_NOTIFICATION,
} from "./actionTypes"

import { addNotification } from "helpers/Module"

export const setLoadingNotification = (isLoading) => ({
    type: 'SET_LOADING',
    payload: isLoading,
});

export const getNotification = (payload) => ({
    type: GET_NOTIFICATION,
    payload: payload,
})

export const listNotification = (payload) => ({
    type: LIST_NOTIFICATION,
    payload: payload,
})


export const addNotificationAction = (payload) => {
    return addNotification(payload);
}

