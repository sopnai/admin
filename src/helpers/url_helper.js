//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register"

//LOGIN
export const POST_FAKE_LOGIN = "/login"
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login"
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd"
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd"
export const PROFILE_BY_MOBILE = "/get/profile-by-mobile"
export const UPDATE_FORGOT_PASSWORD = "/update/forgot-password"

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile"
export const POST_EDIT_PROFILE = "/post-fake-profile"

//PROFILE
export const GET_PROFILE = '/profile';
export const PROFILE_EDIT = '/updateprofile';
export const PROFILE_EDIT_PASS = '/updatePassword';

//DASHBOARD
export const DASHBOARD_DATA = "/dashboardCount";

//CALENDER
export const GET_EVENTS = "/events"
export const ADD_NEW_EVENT = "/add/event"
export const UPDATE_EVENT = "/update/event"
export const DELETE_EVENT = "/delete/event"
export const GET_CATEGORIES = "/categories"


// Admin panel
export const ADMIN_LOGIN = "/auth/login";
export const ADMIN_PROFILE = "/profile";

// Artist
export const ARTIST_GET = '/artist';
export const ARTIST_ADD = '/addartist';
export const ARTIST_UPDATE = '/updateartist';
export const ARTIST_DELETE = '/deleteartist';
export const ARTIST_SINGLE = '/artistsbyid';
export const ARTIST_APPROVED = '/artistapproved';

export const ARTIST_IMG_ADD = '/addartistimage';
export const ARTIST_IMG_DELETE = '/deleteartistimage';


// Client
export const CLIENT_GET = '/user';
export const CLIENT_ADD = '/adduser';
export const CLIENT_UPDATE = '/updateuser';
export const CLIENT_DELETE = '/deleteuser';
export const CLIENT_SINGLE = '/userbyid';


// Booking
export const BOOKING_GET = '/booking';
export const BOOKING_SINGLE = '/bookingbyid';
export const BOOKING_STATUS = '/updatebookginstatus';
export const TAININGBOOKING_GET = '/get/trainigbooking';
export const TAININGBOOKING_UPDATE = '/update/trainigbooking';



// Report
export const REPORT_GET = '/bookingitem/get';
export const REPORT_SINGLE = '/bookingbyid';
export const REPORT_STATUS = '/artists/payment';
export const REPORT_GET_TOTALBOOKINGFEE = '/get/total-booking-fee';


// Notification
export const NOTIFICATION_GET = '/getnotification';
export const NOTIFICATION_ADD = '/createNotification';


// Artist LVL
export const ARTISTLVL_GET = '/artistlevel';
export const ARTISTLVL_EDIT = '/updateartistlevel';


// App versions
export const APP_V_GET = '/appversion';
export const APP_V_EDIT = '/updateappversion/1';

// Categories 
export const CAT_GET = '/service';
export const CAT_ADD_UPDATE = '/addOrUpdateservice';
export const CAT_DELETE = '/deleteservice';


// Sub-Services 
export const SUBS_GET = '/subservice';
export const SUBS_ADD_UPDATE = '/addOrUpdateSubService';
export const SUBS_DELETE = '/deletesubservice';


// Client
export const CHAT_GET = '/chatlist';
export const CHATH_GET = '/chatMessage';


//
export const PAGE_GET = "/pages/get";
export const PAGE_UPDATE = "/pages/update";