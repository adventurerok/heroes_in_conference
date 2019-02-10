import {API} from "./API";
import {Event} from "../events/Event";
import {IDMap} from "../store/IDMap";


const mockEvents: IDMap<Event> = {
    "1": {
        id: "1",
        description: "The first event",
        name: "First",
        startTime: new Date(2019, 1, 1),
        endTime: new Date(2019, 1, 2),
    },
    "2": {
        id: "2",
        description: "The second event",
        name: "Second",
        startTime: new Date(2019, 1, 5),
        endTime: new Date(2019, 1, 8),
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
            throw Error(`Attempt to delete already deleted event with id ${id}`);
        }

        delete mockEvents[id];
    },


};

