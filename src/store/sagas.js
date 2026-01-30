import { all, fork } from "redux-saga/effects"

//public
import AccountSaga from "./auth/register/saga"
import AuthSaga from "./auth/login/saga"
import ForgetSaga from "./auth/forgetpwd/saga"
import ProfileSaga from "./auth/profile/saga"
import LayoutSaga from "./layout/saga"
import calendarSaga from "./calendar/saga"
import clientSaga from "./client/saga";
import artistSaga from "./artist/saga"
import bookingSaga from "./booking/saga"
import dashboardSaga from "./dashboard/saga"
import notificationSaga from "./notification/saga"
import artistLvlSaga from "./artist-lvl/saga"
import catSaga from "./categories/saga"
import subsSaga from "./subServices/saga"
import appVSaga from "./app-v/saga"
import chatSaga from "./chat/saga"
import reportSaga from "./report/saga"


export default function* rootSaga() {
    yield all([
        //public
        AccountSaga(),
        fork(AuthSaga),
        ProfileSaga(),
        dashboardSaga(),
        ForgetSaga(),
        LayoutSaga(),
        artistSaga(),
        clientSaga(),
        bookingSaga(),
        notificationSaga(),
        artistLvlSaga(),
        appVSaga(),
        fork(calendarSaga),
        catSaga(),
        subsSaga(),
        chatSaga(),
        reportSaga(),
    ])
}
