import {
    GET_BOOKING,
    LIST_BOOKING,
    SINGLE_BOOKING
} from "./actionTypes"

const INIT_STATE = {
    booking: [],
    error: {},
    singleBooking: null,
    isLoading: false,
}

const BookingRD = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LIST_BOOKING:
            return {
                ...state,
                booking: action.payload,
                isLoading: false,
            }
        case SINGLE_BOOKING:
            return {
                ...state,
                singleBooking: action.payload,
            }
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            }
        default:
            return state
    }
}

export default BookingRD
