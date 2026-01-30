import { takeEvery, put, call } from "redux-saga/effects"

import {
    GET_CHAT
} from "./actionTypes"

import { listChat, setLoadingChat } from "./actions"

import { getChatList } from "helpers/Module"



function* FunctionfetchChatList({ payload }) {
    try {
        yield put(setLoadingChat(true));
        const response = yield call(getChatList, payload);
        yield put(listChat(response));
    } catch (error) {
        console.log(error);
    } finally {
        yield put(setLoadingChat(false));
    }

}

function* chatSaga() {
    yield takeEvery(GET_CHAT, FunctionfetchChatList);
}

export default chatSaga
