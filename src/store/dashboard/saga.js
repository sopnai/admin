import { takeEvery, put, call } from "redux-saga/effects"

import {

    GET_DASHBOARD,
    LIST_DASHBOARD
} from "./actionTypes"

import { listDashboard, setLoadingDashboard } from "./actions"

import { getDashboardData } from "helpers/Module"



function* FunctionfetchDshboardData({ payload }) {
    try {
        yield put(setLoadingDashboard(true));
        const response = yield call(getDashboardData, payload);
        yield put(listDashboard(response));
    } catch (error) {
        console.log(error);
    } finally {
        yield put(setLoadingDashboard(false));
    }

}


function* dashboardSaga() {
    yield takeEvery(GET_DASHBOARD, FunctionfetchDshboardData);
}

export default dashboardSaga
