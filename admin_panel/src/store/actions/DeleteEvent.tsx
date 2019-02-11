import {API} from "../../api/API";
import {updateEvent} from "./UpdateEvent";
import {Container} from "../Container";
import {Event} from "../../events/Event";
import {AppDispatch} from "../appStore";


export function deleteEvent(event: Event, dispatch: AppDispatch): Promise<void> {
    return API.deleteEvent(event.id).then(value => {
        dispatch(updateEvent(Container.empty(), event.id));
    });
}