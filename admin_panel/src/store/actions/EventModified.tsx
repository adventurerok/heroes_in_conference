import {Container, ModifiedContainer} from "../Container";
import {updateEvent} from "./UpdateEvent";
import {Event} from "../../events/Event";
import {API} from "../../api/API";
import {AppDispatch} from "../appStore";


export function eventModified(event: ModifiedContainer<Event>, dispatch: AppDispatch): Promise<void> {
    dispatch(updateEvent(event));

    return API.updateEvent(event.data).then(value => {
        // we are now in sync
        dispatch(updateEvent(Container.synced(event.data, event.modified)));
    });
}