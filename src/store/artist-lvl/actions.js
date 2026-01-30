import {
    GET_ARTISTLVL,
    LIST_ARTISTLVL,
} from "./actionTypes"

import { addNotification } from "helpers/Module"

export const setLoadingArtistLvl = (isLoading) => ({
    type: 'SET_LOADING',
    payload: isLoading,
});

export const getArtistLvl = (payload) => ({
    type: GET_ARTISTLVL,
    payload: payload,
})

export const listArtistLvl = (payload) => ({
    type: LIST_ARTISTLVL,
    payload: payload,
})

