import { takeEvery, fork, put, all, call } from "redux-saga/effects"

import { GET_PROFILE } from "./actionTypes"
import { setLoadingProfile, listProfile } from "./actions"

import { getProfile } from "helpers/Module"


function* FunctionfetchProfileList({ payload }) {
    try {
        yield put(setLoadingProfile(true));
        const response = yield call(getProfile, payload);
        yield put(listProfile(response));
        console.log(response);

    } catch (error) {
        console.log(error);
    } finally {
        yield put(setLoadingProfile(false));
    }
}


export function* watchProfile() {
    yield takeEvery(GET_PROFILE, FunctionfetchProfileList);
}

function* ProfileSaga() {
    yield all([fork(watchProfile)])
}

export default ProfileSaga
