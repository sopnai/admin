import React from "react";

// Profile
import UserProfile from "../pages/Authentication/user-profile";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "pages/Authentication/Logout";

// Dashboard
import Dashboard from "../pages/Dashboard/index";

import Client from "pages/Client/Client";
import ClientAdd from "pages/Client/ClientAdd/ClientAdd";
import ClientEdit from "pages/Client/ClientEdit/ClientEdit";

import Artist from "pages/Artist/Artist";
import ArtistAdd from "pages/Artist/ArtistAdd/ArtistAdd";
import ArtistEdit from "pages/Artist/ArtistEdit/ArtistEdit";

import Booking from "pages/Booking/Booking";
import BookingView from "pages/Booking/BookingView/BookingView";
import Services from "pages/Services/Services";
import ServiceView from "pages/Services/ServiceView/ServiceView";
import Notification from "pages/Notification/Notification";
import Settings from "pages/Settings/ArtistLVL";
import AppVersion from "pages/Settings/AppVersion";
import SubServices from "pages/Services/ServiceView/SubServices";
import SubServiceView from "pages/Services/ServiceView/SubServiceView";
import { Navigate } from "react-router-dom";
import Chat from "pages/Chat/Chat";
import PageTermsCondition from "pages/Settings/PageTermsCondition";
import PagePrivacyPolicy from "pages/Settings/PagePrivacyPolicy";
import TrainigBooking from "pages/TrainingBooking/TrainingBooking";
import Report from "pages/Report/Report";

import ForgetPassword from "pages/Authentication/ForgetPassword";

const userRoutes = [

    // new path
    { path: "/dashboard", component: <Dashboard /> },

    { path: "/client", component: <Client /> },
    { path: "/client-add", component: <ClientAdd /> },
    { path: "/client-edit/:id", component: <ClientEdit /> },

    { path: "/artist", component: <Artist /> },
    { path: "/artist-add", component: <ArtistAdd /> },
    { path: "/artist-edit/:id", component: <ArtistEdit /> },

    { path: "/booking/", component: <Booking /> },
    { path: "/booking-view/:id", component: <BookingView /> },

    { path: "/training-booking", component: <TrainigBooking /> },


    { path: "/services/", component: <Services /> },
    { path: "/service-view/:categoryId", component: <ServiceView /> },
    { path: "/service-view/", component: <Services /> },
    { path: "/sub-services/:servId", component: <SubServices /> },
    { path: "/sub-services/", component: <Services /> },
    { path: "/sub-service-view/", component: <SubServiceView /> },

    { path: "/report", component: <Report /> },

    { path: "/notification", component: <Notification /> },
    { path: "/artist-lvl", component: <Settings /> },
    { path: "/app-version", component: <AppVersion /> },


    { path: "/chat", component: <Chat /> },

    //pages
    { path: "/page/terms-and-condition", component: <PageTermsCondition /> },
    { path: "/page/privacy-policy", component: <PagePrivacyPolicy /> },

    // //profile
    { path: "/profile", component: <UserProfile /> },

    // this route should be at the end of all other routes
    { path: "/", component: <Navigate to="/dashboard" /> },
    { path: '/logout', component: <Logout /> }
];

const authRoutes = [
    { path: "/login", component: <Login /> },
    { path: "/forgot-password", component: <ForgetPassword /> },
];

export { userRoutes, authRoutes };
