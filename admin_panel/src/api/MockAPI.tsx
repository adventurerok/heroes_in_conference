import {API} from "./API";
import {Event} from "../events/Event";
import {IDMap} from "../store/IDMap";
import {ConferenceMap} from "../maps/ConferenceMap";
import {MapMarker} from "../maps/MapMarker";
import {Achievement} from "../achievements/Achievement";
import * as uuidv4 from "uuid/v4";
import {ContentGroup} from "../groups/ContentGroup";


const mockEvents: IDMap<Event> = {
    "1": {
        id: "1",
        description: "The first event",
        name: "First",
        startTime: new Date(2019, 1, 1).getTime(),
        endTime: new Date(2019, 1, 2).getTime(),
    },
    "2": {
        id: "2",
        description: "The second event",
        name: "Second",
        startTime: new Date(2019, 1, 5).getTime(),
        endTime: new Date(2019, 1, 8).getTime(),
    }
};

const mockMaps : IDMap<ConferenceMap> = {
    "1": {
        id: "1",
        name: "Top Floor",
        path: "/images/top.png",
    },
    "2": {
        id: "2",
        name: "Bottom Floor",
        path: "/images/bottom.png",
    }
};

const mockMarkers: IDMap<MapMarker> = {
    "1": {
        id: "1",
        name: "Intel Lab",
        mapId: "1",
        pos: {
            x: 100,
            y: 200,
        },
        description: "Where the event is",
    },
    "2": {
        id: "2",
        name: "Other End of the Lab",
        mapId: "1",
        pos: {
            x: 500,
            y: 800,
        },
        description: "Yeet",
    },
    "3": {
        id: "3",
        name: "Cafe",
        mapId: "2",
        pos: {
            x: 200,
            y: 300,
        },
        description: "I'm hungry",
    }
};


const mockAchievements: IDMap<Achievement> = {
    "1": {
        id: "1",
        name: "first",
        count: 7,
    },
    "2": {
        id: "2",
        name: "second",
        count: 666,
    }
};

const mockGroups: IDMap<ContentGroup> = {
    "1": {
        id: "1",
        name: "Cows",
        enabled: true,
    },
    "2": {
        id: "2",
        name: "Dragons",
        enabled: false,
    }
}

// the mock API that we use for manual testing
export const MockAPI: API = {

    getEvents: async () => {
        return IDMap.values(mockEvents);
    },

    updateEvent: async (event: Event) => {
        mockEvents[event.id] = event;

        if(event.id === "new") {
            return {
                ...event,
                id: uuidv4(),
            }
        }

        return event;
    },

    deleteEvent: async (id: string) => {
        if(!mockEvents[id]) {
            throw new Error(`Attempt to delete already deleted event with id ${id}`);
        }

        delete mockEvents[id];
    },

    getMaps: async () => {
        return IDMap.values(mockMaps);
    },

    updateMap: async (map: ConferenceMap) => {
        mockMaps[map.id] = map;

        // TODO mock image updating

        return map;
    },

    deleteMap: async (id: string) => {
        if(!mockMaps[id]) {
            throw new Error(`Attempt to delete non-existent map with id ${id}`);
        }

        delete mockMaps[id];
    },

    getMapMarkers: async () => {
        return IDMap.values(mockMarkers);
    },

    createMapMarker: async (mapId, pos) => {
        return {
            id: uuidv4(),
            mapId,
            name: "New Marker",
            description: "",
            pos,
        }
    },

    updateMapMarkers: async (modifiedMarkers: MapMarker[], deletedMarkers: string[]) => {
        // update modified markers
        for (const marker of modifiedMarkers) {
            mockMarkers[marker.id] = marker;
        }

        // delete deleted markers
        for (const deletedMarkerId of deletedMarkers) {
            delete mockMarkers[deletedMarkerId];
        }
    },

    login: async (password) => {
        if(password === "password") {
            document.cookie = "hello";
            return true;
        } else {
            return false;
        }
    },

    checkLoggedIn: async () => {
        return true;
    },

    getAchievements: async () => {
        return IDMap.values(mockAchievements);
    },

    getGroups: async () => {
        return IDMap.values(mockGroups);
    },

    toggleGroup: async (groupId, enabled) => {
        mockGroups[groupId].enabled = enabled;
    }

};

