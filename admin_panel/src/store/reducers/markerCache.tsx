import {Container} from "../Container";
import {AppActionTypes, AppObjectAction} from "../AppActions";
import {MutableCache} from "../Cache";
import {MapMarker} from "../../maps/MapMarker";

export function reduceMarkerCache(state: MutableCache<MapMarker> | undefined, action: AppObjectAction): MutableCache<MapMarker> {
    switch(action.type){
        case AppActionTypes.UPDATE_MARKER_CACHE: {
            // swap out the marker cache for the new data
            return action.cache;
        }
        case AppActionTypes.UPDATE_CACHED_MARKERS: {
            // Update Cached Marker shouldn't arrive unless we have the maps from the server

            console.log("Update cached markers!");
            return MutableCache.updateItems(state || Container.synced({}, Date.now()), action.markers);
        }
        default: {
            // synced because not using mutable cache would create more work
            return state || Container.synced({}, Date.now());
        }
    }
}