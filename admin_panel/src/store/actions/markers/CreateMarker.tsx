import {GridPos} from "../../../maps/MapMarker";
import {AppThunkAction} from "../../AppActions";
import {API} from "../../../api/API";
import {updateCachedMarkers} from "./UpdateCachedMarkers";
import {Container} from "../../Container";


export function createMarker(mapId: string, pos: GridPos): AppThunkAction {
    return dispatch => {
        API.createMapMarker(mapId, pos)
            .then(value => {
                console.log("A new map marker!");
                console.dir(value);
                const changedMarkers = {[value.id]: Container.synced(value, Date.now())};
                dispatch(updateCachedMarkers(changedMarkers))
            });
    };
}