import { takeEvery, put, call } from "redux-saga/effects"

import {
    GET_CLIENT, APPROVE_CLIENT, DELETE_CLIENT, LIST_CLIENT, SINGLE_CLIENT, UPDATE_CLIENT, GET_SINGLE_CLIENT
} from "./actionTypes"

import { listClient, setLoadingClient, storeSingleClientAction } from "./actions"

import { getClientList, approveClient, deleteClient, getSingleClient, updateClient } from "helpers/Module"



function* FunctionfetchClientList({ payload }) {
    try {
        yield put(setLoadingClient(true));
        const response = yield call(getClientList, payload);
        yield put(listClient(response));
    } catch (error) {
        console.log(error);
    } finally {
        yield put(setLoadingClient(false));
    }

}

function* FunctionGetSingleClient({ payload }) {
    try {
        yield put(setLoadingClient(true));
        const response = yield call(getSingleClient, payload);
        yield put(storeSingleClientAction(response));
    } catch (error) {
        console.log(error);
    } finally {
        yield put(setLoadingClient(false));
    }
}


function* clientSaga() {
    yield takeEvery(GET_CLIENT, FunctionfetchClientList);
    yield takeEvery(GET_SINGLE_CLIENT, FunctionGetSingleClient);
}

export default clientSaga
