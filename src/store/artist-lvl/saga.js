import { takeEvery, put, call } from "redux-saga/effects"

import {
    GET_ARTISTLVL
} from "./actionTypes"

import { listArtistLvl, setLoadingArtistLvl } from "./actions"

import { getArtistLvlList } from "helpers/Module"



function* FunctionfetchArtistLvlList({ payload }) {
    try {
        yield put(setLoadingArtistLvl(true));
        const response = yield call(getArtistLvlList, payload);
        yield put(listArtistLvl(response));
    } catch (error) {
        console.log(error);
    } finally {
        yield put(setLoadingArtistLvl(false));
    }

}


function* artistLvlSaga() {
    yield takeEvery(GET_ARTISTLVL, FunctionfetchArtistLvlList);
}

export default artistLvlSaga
