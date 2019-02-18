import {Container} from "../Container";
import {AppActionTypes, AppObjectAction} from "../AppActions";
import {Cache} from "../Cache";
import {MapMarker} from "../../maps/MapMarker";

export function reduceMarkerCache(state: Cache<MapMarker> | undefined, action: AppObjectAction): Cache<MapMarker> {
    switch(action.type){
        case AppActionTypes.UPDATE_MARKER_CACHE: {
            // swap out the marker cache for the new data
            return action.cache;
        }
        case AppActionTypes.UPDATE_CACHED_MARKER: {
            // Update Cached Marker shouldn't arrive unless we have the maps from the server
            return state ? Cache.updateItem(state, action.markerId, action.marker) : Container.empty();
        }
        default: {
            return state || Container.empty();
        }
    }
}