import { takeEvery, put, call } from "redux-saga/effects"

import {
    GET_ARTIST, APPROVE_ARTIST, DELETE_ARTIST, LIST_ARTIST, SINGLE_ARTIST, UPDATE_ARTIST, GET_SINGLE_ARTIST
} from "./actionTypes"

import { listArtist, setLoadingArtist, storeSingleArtistAction } from "./actions"

import { getArtistList, approveArtist, deleteArtist, getSingleArtist, updateArtist } from "helpers/Module"



function* FunctionfetchArtistList({ payload }) {
    try {
        yield put(setLoadingArtist(true));
        const response = yield call(getArtistList, payload);
        yield put(listArtist(response));
    } catch (error) {
        console.log(error);
    } finally {
        yield put(setLoadingArtist(false));
    }
}

function* FunctionGetSingleArtist({ payload }) {
    try {
        yield put(setLoadingArtist(true));
        const response = yield call(getSingleArtist, payload);
        yield put(storeSingleArtistAction(response));
    } catch (error) {
        console.log(error);
    } finally {
        yield put(setLoadingArtist(false));
    }
}


function* artistSaga() {
    yield takeEvery(GET_ARTIST, FunctionfetchArtistList);
    yield takeEvery(GET_SINGLE_ARTIST, FunctionGetSingleArtist);
}

export default artistSaga
