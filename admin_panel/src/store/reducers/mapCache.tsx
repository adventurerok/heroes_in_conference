import {IDMap} from "../IDMap";
import {Container} from "../Container";
import {ConferenceMap} from "../../maps/ConferenceMap";
import {AppActionTypes, AppObjectAction} from "../AppActions";

export function reduceMapCache(state: Container<IDMap<ConferenceMap>> | undefined, action: AppObjectAction): Container<IDMap<ConferenceMap>> {
    switch(action.type){
        case AppActionTypes.UPDATE_MAP_CACHE: {
            // swap out the map cache for the new data
            return action.cache;
        }
        case AppActionTypes.UPDATE_CACHED_MAP: {
            // Update Cached Map shouldn't arrive unless we have the maps from the server
            if(state && Container.isReady(state)) {
                const mapMap = {...state.data};

                if(action.map) {
                    mapMap[action.mapId] = action.map;
                } else {
                    delete mapMap[action.mapId];
                }

                return Container.synced(mapMap, Date.now());
            } else {
                return state || Container.empty();
            }
        }
        default: {
            return state || Container.empty();
        }
    }
}