import {combineReducers} from "redux";
import {AppState} from "./AppState";
import {AppObjectAction} from "./AppActions";
import {reduceEvents} from "./reducers/events";
import {reduceAllEvents} from "./reducers/allEvents";
import {reduceMapCache} from "./reducers/mapCache";
import {reduceMarkerCache} from "./reducers/markerCache";
import {reduceLoggedIn} from "./reducers/loggedIn";
import {reduceAchievementCache} from "./reducers/achievementCache";
import {reduceGroupCache} from "./reducers/groupCache";
import {reduceUsageStats} from "./reducers/usageStats";


export const appReducer = combineReducers<AppState, AppObjectAction>({
    events: reduceEvents,
    allEvents: reduceAllEvents,
    mapCache: reduceMapCache,
    markerCache: reduceMarkerCache,
    loggedIn: reduceLoggedIn,
    achievementCache: reduceAchievementCache,
    groupCache: reduceGroupCache,
    usageStats: reduceUsageStats,
});