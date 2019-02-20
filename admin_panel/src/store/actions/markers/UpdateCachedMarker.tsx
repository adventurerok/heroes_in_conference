import {AppActionTypes} from "../../AppActions";
import {Action} from "redux";
import {MapMarker} from "../../../maps/MapMarker";
import {Container, LoadedContainer} from "../../Container";


export interface UpdateCachedMarkerAction extends Action<AppActionTypes> {
    type: AppActionTypes.UPDATE_CACHED_MARKER,
    markerId: string,
    marker: LoadedContainer<MapMarker> | null, // null for deleted
}

export function updateCachedMarker(marker: LoadedContainer<MapMarker> | null, markerId?: string): UpdateCachedMarkerAction {
    let id = markerId;

    if(!id && marker && Container.isReady(marker)) {
        id = marker.data.id;
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