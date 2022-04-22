export const SET_APP_STATE = 'SET_APP_STATE';
export const START_USAGE_TIME = 'START_USAGE_TIME';
export const END_USAGE_TIME = 'END_USAGE_TIME';

export function setAppState(appState) {
    return { type: SET_APP_STATE, appState };
}

export function startUsageTime() {
    return { type: START_USAGE_TIME };
}

export function endUsageTime() {
    return { type: END_USAGE_TIME };
}