import { takeEvery, put, call } from "redux-saga/effects"

import {
    GET_SUBS
} from "./actionTypes"

import { listSubs, setLoadingSubs } from "./actions"

import { getSubsList } from "helpers/Module"



function* FunctionfetchSubServList({ payload }) {
    try {
        yield put(setLoadingSubs(true))

        const response = yield call(getSubsList, payload)

        yield put(listSubs(payload.servId, response))
    } catch (error) {
        console.error("Error fetching sub-services:", error)
    } finally {
        yield put(setLoadingSubs(false))
    }
}



function* subsSaga() {
    yield takeEvery(GET_SUBS, FunctionfetchSubServList)
}

export default subsSaga
