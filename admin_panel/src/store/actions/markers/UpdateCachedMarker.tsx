import {AppActionTypes} from "../../AppActions";
import {Action} from "redux";
import {MapMarker} from "../../../maps/MapMarker";


export interface UpdateCachedMarkerAction extends Action<AppActionTypes> {
    type: AppActionTypes.UPDATE_CACHED_MARKER,
    markerId: string,
    marker: MapMarker | null, // null for deleted
}

export function updateCachedMarker(marker: MapMarker | null, markerId?: string): UpdateCachedMarkerAction {
    let id = markerId;

    if(!id && marker) {
        id = marker.id;
    }

    if(!id) {
        throw new Error("No marker id provided to updateCachedMarker");
    }

    return {
        type: AppActionTypes.UPDATE_CACHED_MARKER,
        markerId: id,
        marker,
    };
}