import {
    GET_ARTIST,
    LIST_ARTIST,
    APPROVE_ARTIST,
    GET_SINGLE_ARTIST,
    SINGLE_ARTIST
} from "./actionTypes"

import { approveArtist, deleteArtist, updateArtist, addArtist, addArtistImg, deleteArtistImg } from "helpers/Module"

export const setLoadingArtist = (isLoading) => ({
    type: 'SET_LOADING',
    payload: isLoading,
});

export const getArtist = (payload) => ({
    type: GET_ARTIST,
    payload: payload,
})

export const listArtist = (payload) => ({
    type: LIST_ARTIST,
    payload: payload,
})

export const approveArtistAction = (payload) => {
    return approveArtist(payload);
}

export const deleteArtistAction = (payload) => {
    return deleteArtist(payload);
}

export const addArtistAction = (payload) => {
    return addArtist(payload);
}

export const getSingleArtistAction = (payload) => ({
    type: GET_SINGLE_ARTIST,
    payload: payload,
})

export const storeSingleArtistAction = (payload) => ({
    type: SINGLE_ARTIST,
    payload: payload,
});

export const updateArtistAction = (id, payload) => {
    return updateArtist(id, payload);
}


export const addArtistImgAction = (payload) => {
    return addArtistImg(payload);
}

export const deleteArtistImgAction = (payload) => {
    return deleteArtistImg(payload);
}