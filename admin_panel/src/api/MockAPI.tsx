import {API} from "./API";
import {Event} from "../events/Event";
import {IDMap} from "../store/IDMap";
import {ConferenceMap} from "../maps/ConferenceMap";


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

// the mock API that we use for manual testing
export const MockAPI: API = {

    getEvents: async () => {
        return IDMap.values(mockEvents);
    },

    updateEvent: async (event: Event) => {
        mockEvents[event.id] = event;
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
    },

    deleteMap: async (id: string) => {
        if(!mockMaps[id]) {
            throw new Error(`Attempt to delete non-existent map with id ${id}`);
        }

        delete mockMaps[id];
    },

};

