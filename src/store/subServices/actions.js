import {
    GET_SUBS,
    LIST_SUBS,
} from "./actionTypes"

import { addUpdSubs, deleteSubs } from "helpers/Module"

export const setLoadingSubs = (isLoading) => ({
    type: 'SET_LOADING',
    payload: isLoading,
});

export const getSubs = (payload) => ({
    type: GET_SUBS,
    payload: payload,
})

export const listSubs = (servId, payload) => ({
    type: LIST_SUBS,
    payload: { servId, data: payload },
});

export const addUpdSubsAction = (payload) => {
    return addUpdSubs(payload);
}

export const deleteSubsAction = (payload) => {
    return deleteSubs(payload);
}
