import {Event} from "../events/Event";
import {ConferenceMap} from "../maps/ConferenceMap";
import {MapMarker} from "../maps/MapMarker";
import {Achievement} from "../achievements/Achievement";
import {RealAPI} from "./RealAPI";

export interface API {

    // get all events from the server
    getEvents: () => Promise<Event[]>,

    // delete an event
    deleteEvent: (id: string) => Promise<void>,

    // update or create an event
    updateEvent: (event: Event) => Promise<Event>,

    getMaps: () => Promise<ConferenceMap[]>,

    deleteMap: (id: string) => Promise<void>,

    // base64 string of image data, you can probably infer image type from this
    // new ConferenceMap returned has the new url to the image, if needed
    updateMap: (map: ConferenceMap, image?: string) => Promise<ConferenceMap>,

    getMapMarkers: () => Promise<MapMarker[]>,

    updateMapMarkers: (modifiedMarkers: MapMarker[], deletedMarkers: string[]) => Promise<void>,

    login: (password: string) => Promise<boolean>,

    getAchievements: () => Promise<Achievement[]>,

}

export const API : API = RealAPI;