import {Container, ErrorState, ModifiedContainer} from "../Container";
import {AppThunkAction} from "../AppActions";
import {updateEvent} from "./UpdateEvent";
import {Event} from "../../events/Event";
import {API} from "../../api/API";


export function eventModified(event: ModifiedContainer<Event>): AppThunkAction {
    return dispatch => {
        dispatch(updateEvent(event));

        API.updateEvent(event.data).then(value => {

            // we are now in sync
            dispatch(updateEvent(Container.synced(event.data, event.modified)));

        }).catch(reason => {
            const error : ErrorState = {
                tries: event.error ? event.error.tries + 1 : 1,
                timeErrored: Date.now(),
                errorMsg: reason,
                errorData: reason,
            };

            // attach error data to the container
            dispatch(updateEvent(Container.modified(event.data, event.modified, error)));
        });
    };
}