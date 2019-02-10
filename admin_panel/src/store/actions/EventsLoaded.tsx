import {AppActionTypes} from "../AppActions";
import {Event} from "../../events/Event";
import {Action} from "redux";


export interface EventsLoadedAction extends Action<AppActionTypes> {
    type: AppActionTypes.EVENTS_LOADED,
    events: Event[] // the list of events that we have loaded
}

export function eventsLoaded(events: Event[]): EventsLoadedAction {
    return {
        type: AppActionTypes.EVENTS_LOADED,
        events,
    }
}