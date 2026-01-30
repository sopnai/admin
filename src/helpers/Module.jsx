import axios from "axios"
import { post, del, get, put } from "./api_helper"
import * as url from "./url_helper"

// Gets the logged in user data from local session
const getLoggedInUser = () => {
    const user = localStorage.getItem("user")
    if (user) return JSON.parse(user)
    return null
}

//is user is logged in
export const isUserAuthenticated = () => {
    return getLoggedInUser() !== null
}

// Login Method
export const postLogin = data => post(url.ADMIN_LOGIN, data);

// Edit profile
export const postAdminProfile = data => post(url.ADMIN_PROFILE, data);

// Dashboard
export const getDashboardData = params => get(url.DASHBOARD_DATA, { params });

// get Profile
export const getProfile = (params) => get(url.GET_PROFILE, { params });
export const updateUserPassword = (data) => post(url.PROFILE_EDIT_PASS, data);
export const updateUserProfile = (id, params) => put(url.PROFILE_EDIT + '/' + id, params);

// Get Artist
export const getArtistList = params => get(url.ARTIST_GET, { params });
export const approveArtist = params => post(url.ARTIST_APPROVED, params);
export const addArtist = params => post(url.ARTIST_ADD, params, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateArtist = (id, params) => put(url.ARTIST_UPDATE + '/' + id, params, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteArtist = params => del(url.ARTIST_DELETE + '/' + params);
export const getSingleArtist = params => get(url.ARTIST_SINGLE + '/' + params);

export const addArtistImg = params => post(url.ARTIST_IMG_ADD, params, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteArtistImg = params => del(url.ARTIST_IMG_DELETE + '/' + params);


//get client
export const getClientList = params => get(url.CLIENT_GET, { params });
export const addClient = params => post(url.CLIENT_ADD, params, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateClient = (id, params) => put(url.CLIENT_UPDATE + '/' + id, params, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteClient = params => del(url.CLIENT_DELETE + '/' + params);
export const getSingleClient = params => get(url.CLIENT_SINGLE + '/' + params);


// Get booking
export const getBookingList = params => get(url.BOOKING_GET, { params });
export const statusBooking = params => post(url.BOOKING_STATUS, params);
export const getSingleBooking = params => get(url.BOOKING_SINGLE + '/' + params);
export const getTainingBookingList = params => get(url.TAININGBOOKING_GET, { params });
export const updateTainingBookingList = params => post(url.TAININGBOOKING_UPDATE, params);

//get Report
export const getReportList = params => get(url.REPORT_GET, { params });
export const statusReport = params => post(url.REPORT_STATUS, params);
export const getSingleReport = params => get(url.REPORT_SINGLE + '/' + params);
export const controllGetTotalBookingFeee = params => get(url.REPORT_GET_TOTALBOOKINGFEE, { params });



//get notification
export const getNotificationList = params => get(url.NOTIFICATION_GET, { params });
export const addNotification = (params) => post(url.NOTIFICATION_ADD, params);


//get artist lvl
export const getArtistLvlList = params => get(url.ARTISTLVL_GET, { params });
export const updateArtistLvl = (data) => post(url.ARTISTLVL_EDIT, data);

//get app versions
export const getAppVList = params => get(url.APP_V_GET, { params });
export const updateAppV = (data) => post(url.APP_V_EDIT, data);

//get categories
export const getCatList = params => get(url.CAT_GET, { params });
export const addUpdCat = params => post(url.CAT_ADD_UPDATE, params, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteCat = params => del(url.CAT_DELETE + '/' + params);

//get sub-services
export const getSubsList = params => get(`${url.SUBS_GET}/${params.servId}`, { params });
export const addUpdSubs = params => post(url.SUBS_ADD_UPDATE, params, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteSubs = params => del(url.SUBS_DELETE + '/' + params);


//get app versions
export const getChatList = params => get(url.CHAT_GET, { params });
export const getChatH = params => get(url.CHATH_GET, { params });


//Pages
export const getPages = params => get(`${url.PAGE_GET}`, { params });
export const updatePages = params => post(`${url.PAGE_UPDATE}`, params);

export const getMobileProfile = params => post(`${url.PROFILE_BY_MOBILE}`, params);
export const updateForgotPassword = params => post(`${url.UPDATE_FORGOT_PASSWORD}`, params);

