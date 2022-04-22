import { combineReducers } from 'redux';
import { SET_APP_STATE, START_USAGE_TIME, END_USAGE_TIME } from './actions';

const appState = (state=null, action) => {
    switch(action.type) {
        case SET_APP_STATE:
            return action.appState;
        default:
            return state;
    }
}

const usageTimeInitialState = {
    usageStartTime: null
}

const usageTime = (state=usageTimeInitialState, action) => {
    switch(action.type) {
        case START_USAGE_TIME:
            if (state.usageStartTime !== null) {
                throw new Error("usageStartTime should be null.");
            }
            return { usageStartTime: new Date() };
        case END_USAGE_TIME:
            if (state.usageStartTime === null) {
                throw new Error("usageStartTime should not be null.");
            }
            return { usageStartTime: null };
        default:
            return state;
    }
}

export default reduxApp = combineReducers({
    appState,
    usageTime
});
