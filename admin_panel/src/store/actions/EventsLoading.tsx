import {AppActionTypes} from "../AppActions";
import {Action} from "redux";


export interface EventsLoadingAction extends Action<AppActionTypes> {
    type: AppActionTypes.EVENTS_LOADING,
    loading: boolean,
}

export function eventsLoading(loading: boolean): EventsLoadingAction {
    return {
        type: AppActionTypes.EVENTS_LOADING,
        loading,
    }
}