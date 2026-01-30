import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"
import ArtistRD from "./artist/reducer"

//Calendar
import calendar from "./calendar/reducer"

//Client
import ClientRD from "./client/reducer";

//booking
import BookingRD from "./booking/reducer";
import DashboardRD from "./dashboard/reducer"
import NotificationRD from "./notification/reducer"
import ArtistLvlRD from "./artist-lvl/reducer"
import CatRD from "./categories/reducer"
import SubServRD from "./subServices/reducer"
import AppVRD from "./app-v/reducer"
import ChatRD from "./chat/reducer"
import ReportRD from "./report/reducer"

const rootReducer = combineReducers({
    // public
    Layout,
    Login,
    Account,
    ForgetPassword,
    Profile,
    DashboardRD,
    calendar,
    ArtistRD,
    ClientRD,
    BookingRD,
    NotificationRD,
    ArtistLvlRD,
    AppVRD,
    CatRD,
    SubServRD,
    ChatRD,
    ReportRD,
})

export default rootReducer
