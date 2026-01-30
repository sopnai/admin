import {
    GET_CHAT,
    LIST_CHAT
} from "./actionTypes"

import { deleteClient, addClient, updateClient } from "helpers/Module"

export const setLoadingChat = (isLoading) => ({
    type: 'SET_LOADING',
    payload: isLoading,
});

export const getChat = (payload) => ({
    type: GET_CHAT,
    payload: payload,
})

export const listChat = (payload) => ({
    type: LIST_CHAT,
    payload: payload,
})

