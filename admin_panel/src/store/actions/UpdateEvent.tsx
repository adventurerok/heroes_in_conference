import {Event} from "../../events/Event";
import {AppActionTypes} from "../AppActions";
import {Action} from "redux";
import {Container} from "../Container";

export interface UpdateEventAction extends Action<AppActionTypes> {
    type: AppActionTypes.UPDATE_EVENT,
    eventId: string,
    event: Container<Event>,
}

export function updateEvent(event: Container<Event>, eventId?: string): UpdateEventAction {
    let id = eventId;
    if(!id) {
        if(Container.isReady(event)) {
            id = event.data.id;
        } else {
            throw Error("No id provided to updateEvent explicitly or from container");
        }
    }

    return {
        type: AppActionTypes.UPDATE_EVENT,
        event,
        eventId: id
    }
}