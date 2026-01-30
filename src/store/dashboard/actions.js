import {
    GET_DASHBOARD,
    LIST_DASHBOARD
} from "./actionTypes"

import { getDashboardData } from "helpers/Module"

export const setLoadingDashboard = (isLoading) => ({
    type: 'SET_LOADING',
    payload: isLoading,
});

export const getDashboard = (payload) => ({
    type: GET_DASHBOARD,
    payload: payload,
})

export const listDashboard = (payload) => ({
    type: LIST_DASHBOARD,
    payload: payload,
})
