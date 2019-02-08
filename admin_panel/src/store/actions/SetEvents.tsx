import {AppActionTypes} from "../AppActions";
import {Event} from "../../events/Event";
import {Action} from "redux";


export interface SetEventsAction extends Action<AppActionTypes> {
    type: AppActionTypes.SET_EVENTS,
    events: Event[] // the list of events that we have loaded
}

export function setEvents(events: Event[]): SetEventsAction {
    return {
        type: AppActionTypes.SET_EVENTS,
        events,
    }
}