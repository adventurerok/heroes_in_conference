import {Action} from "redux";
import {AppActionTypes} from "../../AppActions";
import {IDMap} from "../../IDMap";
import {Container} from "../../Container";
import {MapMarker} from "../../../maps/MapMarker";


export interface UpdateMarkerCacheAction extends Action<AppActionTypes> {
    type: AppActionTypes.UPDATE_MARKER_CACHE,
    cache: Container<IDMap<MapMarker>>,
}

export function updateMarkerCache(cache: Container<IDMap<MapMarker>>): UpdateMarkerCacheAction {
    return {
        type: AppActionTypes.UPDATE_MARKER_CACHE,
        cache,
    };
}