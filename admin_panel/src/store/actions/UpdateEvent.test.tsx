import {updateEvent} from "./UpdateEvent";
import {Container} from "../Container";
import {Event} from "../../events/Event";

describe("updateEvent", () => {

    it("throws an error when no id is provided in any way", () => {
        expect(() => {
            updateEvent(Container.empty());
        }).toThrow();
    });

    it("gets correct id when passed in through container", () => {
        const id = "my_id";

        const fullContainer = Container.synced({
            id,
            startTime: 0,
            endTime: 0,
            name: "My Event",
            description: "Yeet"
        } as Event, Date.now());

        const action = updateEvent(fullContainer);

        expect(action.eventId).toEqual(id);
    });

});