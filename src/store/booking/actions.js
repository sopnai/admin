import {
    GET_BOOKING,
    LIST_BOOKING,
    STATUS_BOOKING,
    GET_SINGLE_BOOKING,
    SINGLE_BOOKING
} from "./actionTypes"

import { statusBooking, deleteBooking, updateBooking, getTainingBookingList, updateTainingBookingList, controllGetTotalBookingFeee } from "helpers/Module"

export const setLoadingBooking = (isLoading) => ({
    type: 'SET_LOADING',
    payload: isLoading,
});

export const getBooking = (payload) => ({
    type: GET_BOOKING,
    payload: payload,
})

export const listBooking = (payload) => ({
    type: LIST_BOOKING,
    payload: payload,
})

export const statusBookingAction = (payload) => {
    return statusBooking(payload);
}

export const getSingleBookingAction = (payload) => ({
    type: GET_SINGLE_BOOKING,
    payload: payload,
})

export const storeSingleBookingAction = (payload) => ({
    type: SINGLE_BOOKING,
    payload: payload,
});

export const getTariningBooking = (payload) => getTainingBookingList(payload);

export const updateTariningBooking = (payload) => updateTainingBookingList(payload);

export const getTotalBookingFeee = (payload) => controllGetTotalBookingFeee(payload);