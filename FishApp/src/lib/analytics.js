import { AppState } from 'react-native';
import { setAppState, startUsageTime, endUsageTime } from './actions';
import { addToTotalUsageTimeInSeconds } from './storage';

const background = "background";
const active = "active";
const inactive = "inactive";

export const setupAnalytics = (store) => {
  AppState.addEventListener('change', async (newAppState) => {
    const { appState } = store.getState();
    store.dispatch(setAppState(newAppState));
    await handleAppStateChange(store, appState, newAppState);
  });
  store.dispatch(startUsageTime());
}

const handleAppStateChange = async (store, oldAppState, newAppState) => {
  if (oldAppState === null) {
    return;
  }
  console.log(`AppState has changed from ${oldAppState} to ${newAppState}.`);

  if ((oldAppState === background || oldAppState === inactive) && newAppState === active) {
    store.dispatch(startUsageTime());
    console.log("start time");
  } else if (oldAppState === active && (newAppState === background || newAppState === inactive)) {
    const { usageTime: { usageStartTime } } = store.getState();
    const millisecondsInASecond = 1000;
    const usageTime = (new Date() - usageStartTime) / millisecondsInASecond;
    const totalUsageTimeInSeconds = await addToTotalUsageTimeInSeconds(usageTime);
    console.log("Total usage time: " + totalUsageTimeInSeconds) 
    store.dispatch(endUsageTime());
    console.log("end time");
  } else if ((oldAppState === background && newAppState === inactive)
    || (oldAppState === inactive && newAppState === background)) {
      // Do nothing.
    console.log("ignored transition");
  } else {
    throw new Error(`Unexpected AppState transition: ${oldAppState} to ${newAppState}.`)
  }
}