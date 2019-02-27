import {Event} from "../events/Event";
import {ConferenceMap} from "../maps/ConferenceMap";
import {GridPos, MapMarker} from "../maps/MapMarker";
import {Achievement} from "../achievements/Achievement";
import {RealAPI} from "./RealAPI";
import {ContentGroup} from "../groups/ContentGroup";
import {UsageStat} from "../stats/UsageStat";

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
    updateMap: (map: ConferenceMap, image?: Blob) => Promise<ConferenceMap>,

    getMapMarkers: (mapId: string) => Promise<MapMarker[]>,

    createMapMarker: (mapId: string, pos: GridPos) => Promise<MapMarker>,

    updateMapMarkers: (modifiedMarkers: MapMarker[], deletedMarkers: string[]) => Promise<void>,

    login: (password: string) => Promise<boolean>,

    checkLoggedIn: () => Promise<boolean>,

    getAchievements: () => Promise<Achievement[]>,

    getGroups: () => Promise<ContentGroup[]>,

    toggleGroup: (groupId: string, enabled: boolean) => Promise<void>,

    getUsageStats: () => Promise<UsageStat[]>,

    getUserCount: () => Promise<number>

}

export const API : API = RealAPI;