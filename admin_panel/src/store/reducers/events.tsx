import {AppObjectAction} from "../AppActions";
import {IDMap} from "../AppState";
import {Event} from "../../events/Event"


export function reduceEvents(state: IDMap<Event> | undefined, action: AppObjectAction): IDMap<Event> {
    switch(action.type){
        default: {
            return state || {};
        }
    }
}