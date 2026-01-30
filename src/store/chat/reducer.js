import {
    LIST_CHAT
} from "./actionTypes"

const INIT_STATE = {
    chat: [],
    error: {},
    isLoading: false,
}

const ChatRD = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LIST_CHAT:
            return {
                ...state,
                chat: action.payload,
                isLoading: false,
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

export default ChatRD
