import {Event} from "../events/Event";
import {MockAPI} from "./MockAPI";
import {ConferenceMap} from "../maps/ConferenceMap";
import {MapMarker} from "../maps/MapMarker";

export interface API {

    // get all events from the server
    getEvents: () => Promise<Event[]>,

    // delete an event
    deleteEvent: (id: string) => Promise<void>,

    // update or create an event
    updateEvent: (event: Event) => Promise<void>,

    getMaps: () => Promise<ConferenceMap[]>,

    deleteMap: (id: string) => Promise<void>,

    updateMap: (map: ConferenceMap) => Promise<void>,

    getMapMarkers: () => Promise<MapMarker[]>,

    deleteMapMarker: (id: string) => Promise<void>,

    updateMapMarker: (marker: MapMarker) => Promise<void>,

}

export const API : API = MockAPI;