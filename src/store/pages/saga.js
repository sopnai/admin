import { takeEvery, put, call } from "redux-saga/effects"

import {
    GET_APP_V
} from "./actionTypes"

import { listAppV, setLoadingAppV } from "./actions"

import { getAppVList } from "helpers/Module"



function* FunctionfetchAppVList({ payload }) {
    try {
        yield put(setLoadingAppV(true));
        const response = yield call(getAppVList, payload);
        yield put(listAppV(response));
    } catch (error) {
        console.log(error);
    } finally {
        yield put(setLoadingAppV(false));
    }

}


function* appVSaga() {
    yield takeEvery(GET_APP_V, FunctionfetchAppVList);
}

export default appVSaga
