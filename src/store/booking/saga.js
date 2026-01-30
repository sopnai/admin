import { takeEvery, put, call } from "redux-saga/effects"

import {
    GET_BOOKING, APPROVE_BOOKING, DELETE_BOOKING, LIST_BOOKING, SINGLE_BOOKING, UPDATE_BOOKING, GET_SINGLE_BOOKING
} from "./actionTypes"

import { listBooking, setLoadingBooking, storeSingleBookingAction } from "./actions"

import { getBookingList, approveBooking, deleteBooking, getSingleBooking, updateBooking } from "helpers/Module"



function* FunctionfetchBookingList({ payload }) {
    try {
        yield put(setLoadingBooking(true));
        const response = yield call(getBookingList, payload);
        yield put(listBooking(response));

    } catch (error) {
        console.log(error);
    } finally {
        yield put(setLoadingBooking(false));
    }
}

function* FunctionGetSingleBooking({ payload }) {
    try {
        yield put(setLoadingBooking(true));
        const response = yield call(getSingleBooking, payload);
        yield put(storeSingleBookingAction(response));
    } catch (error) {
        console.log(error);
    } finally {
        yield put(setLoadingBooking(false));
    }
}


function* bookingSaga() {
    yield takeEvery(GET_BOOKING, FunctionfetchBookingList);
    yield takeEvery(GET_SINGLE_BOOKING, FunctionGetSingleBooking);
}

export default bookingSaga
