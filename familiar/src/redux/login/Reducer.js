import {combineReducers} from "redux";

const initState = {
    account: null
}

function accountReducer(state = initState, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                account: action.payload
            }
        case "LOGOUT":
            return {
                ...state,
                account: null
            }
        case 'UPDATE_AVATAR':
            return {
                ...state,
                account: {
                    ...state.account,
                    profilePictureUrl: action.payload
                }
            };

        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    user: accountReducer
});