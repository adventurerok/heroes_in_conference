import {Event} from "../events/Event";

export interface IDMap<T> {
    [id: string]: T
}

export interface AppState {
    events: IDMap<Event>,
    eventsLoading: boolean,
    eventsLoadError?: string,
}