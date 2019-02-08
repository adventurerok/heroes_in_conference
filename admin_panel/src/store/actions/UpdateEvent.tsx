import {Event} from "../../events/Event";
import {AppActionTypes} from "../AppActions";
import {Action} from "redux";

export interface UpdateEventAction extends Action<AppActionTypes> {
    type: AppActionTypes.UPDATE_EVENT,
    event: Event,
}

export function updateEvent(event: Event): UpdateEventAction {
    return {
        type: AppActionTypes.UPDATE_EVENT,
        event,
    }
}