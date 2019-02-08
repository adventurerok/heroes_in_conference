import {combineReducers} from "redux";
import {AppState} from "./AppState";
import {AppObjectAction} from "./AppActions";
import {reduceEvents} from "./reducers/events";
import {reduceEventsLoading} from "./reducers/eventsLoading";
import {reduceEventsLoadError} from "./reducers/eventsLoadError";


export const appReducer = combineReducers<AppState, AppObjectAction>({
    events: reduceEvents,
    eventsLoading: reduceEventsLoading,
    eventsLoadError: reduceEventsLoadError
});