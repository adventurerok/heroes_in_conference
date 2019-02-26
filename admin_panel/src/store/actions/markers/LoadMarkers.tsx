import {AppThunkAction} from "../../AppActions";
import {API} from "../../../api/API";
import {Container} from "../../Container";
import {IDMap} from "../../IDMap";
import {updateCachedMarkers} from "./UpdateCachedMarkers";


export function loadMarkers(mapId: string): AppThunkAction {
    return dispatch => {


        API.getMapMarkers(mapId)
            .then(markers => {
                // use the same time for all containers
                const currentTime = Date.now();

                // loaded containers
                const containers = markers.map(marker => Container.synced(marker, currentTime));

                // IDMap
                const idMapOfMarkers = IDMap.fromArray(containers, marker => marker.data.id);

                // MutableCache is really just Container<IDMap<LoadedContainer<T>>>
                dispatch(updateCachedMarkers(idMapOfMarkers));
            });
    }
}