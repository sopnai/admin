import {
    GET_CLIENT,
    LIST_CLIENT,
    GET_SINGLE_CLIENT,
    SINGLE_CLIENT
} from "./actionTypes"

import { deleteClient, addClient, updateClient } from "helpers/Module"

export const setLoadingClient = (isLoading) => ({
    type: 'SET_LOADING',
    payload: isLoading,
});

export const getClient = (payload) => ({
    type: GET_CLIENT,
    payload: payload,
})

export const listClient = (payload) => ({
    type: LIST_CLIENT,
    payload: payload,
})

export const deleteClientAction = (payload) => {
    return deleteClient(payload);
}

export const addClientAction = (payload) => {
    return addClient(payload);
}

export const getSingleClientAction = (payload) => ({
    type: GET_SINGLE_CLIENT,
    payload: payload,
})

export const storeSingleClientAction = (payload) => ({
    type: SINGLE_CLIENT,
    payload: payload,
});

export const updateClientAction = (id, payload) => {
    return updateClient(id, payload);
}
