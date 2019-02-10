import {AppActionTypes} from "../AppActions";
import {Action} from "redux";


export interface EventsLoadingAction extends Action<AppActionTypes> {
    type: AppActionTypes.EVENTS_LOADING,
}

export function eventsLoading(): EventsLoadingAction {
    return {
        type: AppActionTypes.EVENTS_LOADING,
    }
}