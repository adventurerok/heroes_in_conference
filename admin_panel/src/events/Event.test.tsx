import {Event} from './Event';

describe("Event.sortStartTime", () => {

    const eventA : Event = {
        startTime: 100,
        endTime: 200,
        name: "1_A",
        description: "",
        id: ""
    };

    const eventB : Event = {
        startTime: 200,
        endTime: 250,
        name: "2_B",
        description: "",
        id: ""
    };

    const eventC : Event = {
        startTime: 300,
        endTime: 400,
        name: "1_C",
        description: "",
        id: ""
    };

    const eventD : Event = {
        startTime: 100,
        endTime: 1000,
        name: "1_D",
        description: "",
        id: ""
    };

    const eventE : Event = {
        startTime: 300,
        endTime: 305,
        name: "2_E",
        description: "",
        id: ""
    };


    it("sorts A,B,C,D,E correctly", () => {
        let events = [eventC, eventB, eventA, eventE, eventD];
        events = events.sort(Event.sortStartTime);

        expect(events).toEqual([eventD, eventA, eventB, eventC, eventE]);
    })

});