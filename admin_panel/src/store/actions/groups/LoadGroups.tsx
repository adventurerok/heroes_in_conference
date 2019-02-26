import {AppThunkAction} from "../../AppActions";
import {API} from "../../../api/API";
import {Container, ErrorState} from "../../Container";
import {IDMap} from "../../IDMap";
import {updateGroupCache} from "./UpdateGroupCache";


export function loadGroups(): AppThunkAction {
    return dispatch => {

        // we have started loading
        dispatch(updateGroupCache(Container.loading(Date.now())));

        API.getGroups()
            .then(groups => {
                const idMapOfGroups = IDMap.fromArray(groups, map => map.id);
                dispatch(updateGroupCache(Container.synced(idMapOfGroups, Date.now())));
            })
            .catch(reason => {
                const error: ErrorState = {
                    timeErrored: Date.now(),
                    tries: 1,
                    errorMsg: reason,
                    errorData: reason,
                };

                dispatch(updateGroupCache(Container.errored(error)));
            });
    }
}