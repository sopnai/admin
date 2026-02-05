import {
    GET_REPORT,
    LIST_REPORT,
    GET_SINGLE_REPORT,
    SINGLE_REPORT
} from "./actionTypes"

import { statusReport } from "helpers/Module"

export const setLoadingReport = (isLoading) => ({
    type: 'SET_LOADING',
    payload: isLoading,
});

export const getReport = (payload) => ({
    type: GET_REPORT,
    payload: payload,
})

export const listReport = (payload) => ({
    type: LIST_REPORT,
    payload: payload,
})

export const statusReportAction = (payload) => {
    return statusReport(payload);
}

export const getSingleReportAction = (payload) => ({
    type: GET_SINGLE_REPORT,
    payload: payload,
})

export const storeSingleReportAction = (payload) => ({
    type: SINGLE_REPORT,
    payload: payload,
});

