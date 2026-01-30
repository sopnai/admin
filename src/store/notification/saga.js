import { takeEvery, put, call } from "redux-saga/effects"

import {
    GET_NOTIFICATION
} from "./actionTypes"

import { listNotification, setLoadingNotification } from "./actions"

import { getNotificationList } from "helpers/Module"



function* FunctionfetchNotificationList({ payload }) {
    try {
        yield put(setLoadingNotification(true));
        const response = yield call(getNotificationList, payload);
        yield put(listNotification(response));
    } catch (error) {
        console.log(error);
    } finally {
        yield put(setLoadingNotification(false));
    }

}


function* notificationSaga() {
    yield takeEvery(GET_NOTIFICATION, FunctionfetchNotificationList);
}

export default notificationSaga
