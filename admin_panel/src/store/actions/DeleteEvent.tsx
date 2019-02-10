import {AppThunkAction} from "../AppActions";
import {API} from "../../api/API";
import {updateEvent} from "./UpdateEvent";
import {Container, ErrorState} from "../Container";
import {Event} from "../../events/Event";


export function deleteEvent(event: Event): AppThunkAction {
    return dispatch => {
        API.deleteEvent(event.id).then(value => {
            dispatch(updateEvent(Container.empty(), event.id));
        }).catch(reason => {
            const error : ErrorState = {
                tries: 1,
                timeErrored: Date.now(),
                errorMsg: reason,
                errorData: reason,
            };

            dispatch(updateEvent(Container.modified(event, Date.now(), error)));
        });
    };
}