import {AppActionTypes} from "../AppActions";
import {Action} from "redux";
import {ErrorState} from "../Container";


export interface EventsLoadErrorAction extends Action<AppActionTypes> {
    type: AppActionTypes.EVENTS_LOAD_ERROR,
    error: ErrorState,
}

export function eventsLoadError(error: ErrorState): EventsLoadErrorAction {
    return {
        type: AppActionTypes.EVENTS_LOAD_ERROR,
        error,
    }
}