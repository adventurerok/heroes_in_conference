import {AppActionTypes} from "../AppActions";
import {Action} from "redux";


export interface EventsLoadErrorAction extends Action<AppActionTypes> {
    type: AppActionTypes.EVENTS_LOAD_ERROR,
    error: string,
}

export function eventsLoadError(error: string): EventsLoadErrorAction {
    return {
        type: AppActionTypes.EVENTS_LOAD_ERROR,
        error,
    }
}