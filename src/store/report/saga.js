import { takeEvery, put, call } from "redux-saga/effects"

import {
    GET_REPORT, GET_SINGLE_REPORT
} from "./actionTypes"

import { listReport, setLoadingReport, storeSingleReportAction } from "./actions"

import { getReportList, getSingleReport } from "helpers/Module"



function* FunctionfetchReportList({ payload }) {
    try {
        yield put(setLoadingReport(true));
        const response = yield call(getReportList, payload);
        yield put(listReport(response));

    } catch (error) {
        console.log(error);
    } finally {
        yield put(setLoadingReport(false));
    }
}

function* FunctionGetSingleReport({ payload }) {
    try {
        yield put(setLoadingReport(true));
        const response = yield call(getSingleReport, payload);
        yield put(storeSingleReportAction(response));
    } catch (error) {
        console.log(error);
    } finally {
        yield put(setLoadingReport(false));
    }
}


function* reportSaga() {
    yield takeEvery(GET_REPORT, FunctionfetchReportList);
    yield takeEvery(GET_SINGLE_REPORT, FunctionGetSingleReport);
}

export default reportSaga
