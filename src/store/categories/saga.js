import { takeEvery, put, call } from "redux-saga/effects"

import {
    GET_CAT
} from "./actionTypes"

import { listCat, setLoadingCat } from "./actions"

import { getCatList } from "helpers/Module"


function* FunctionfetchCatList({ payload }) {
    try {
        yield put(setLoadingCat(true));

        // Call API with payload
        const response = yield call(getCatList, payload);

        yield put(listCat(payload.categoryId, response));
    } catch (error) {
        console.log(error);
    } finally {
        yield put(setLoadingCat(false));
    }
}




function* catSaga() {
    yield takeEvery(GET_CAT, FunctionfetchCatList);
}

export default catSaga;
