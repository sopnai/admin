import {
    GET_CAT,
    LIST_CAT,
} from "./actionTypes"

import { addUpdCat, deleteCat } from "helpers/Module"

export const setLoadingCat = (isLoading) => ({
    type: 'SET_LOADING',
    payload: isLoading,
});

export const getCat = (payload) => ({
    type: GET_CAT,
    payload: payload,
})

export const listCat = (categoryId, payload) => ({
    type: LIST_CAT,
    payload: { categoryId, data: payload },
});

export const addUpdCatAction = (payload) => {
    return addUpdCat(payload);
}

export const deleteCatAction = (payload) => {
    return deleteCat(payload);
}