import {combineReducers} from "redux";
import {AppState} from "./AppState";
import {AppObjectAction} from "./AppActions";
import {reduceEvents} from "./reducers/events";
import {reduceAllEvents} from "./reducers/allEvents";
import {reduceMapCache} from "./reducers/mapCache";


export const appReducer = combineReducers<AppState, AppObjectAction>({
    events: reduceEvents,
    allEvents: reduceAllEvents,
    mapCache: reduceMapCache,
});