import {AppThunkAction} from "../../AppActions";
import {API} from "../../../api/API";
import {updateMarkerCache} from "./UpdateMarkerCache";
import {Container, ErrorState} from "../../Container";
import {IDMap} from "../../IDMap";


export function loadMarkers(): AppThunkAction {
    return dispatch => {

        // we have started loading
        dispatch(updateMarkerCache(Container.loading(Date.now())));

        API.getMapMarkers()
            .then(markers => {
                const idMapOfMarkers = IDMap.fromArray(markers, map => map.id);
                dispatch(updateMarkerCache(Container.synced(idMapOfMarkers, Date.now())));
            })
            .catch(reason => {
                const error: ErrorState = {
                    timeErrored: Date.now(),
                    tries: 1,
                    errorMsg: reason,
                    errorData: reason,
                };

                dispatch(updateMarkerCache(Container.errored(error)));
            });
    }
}