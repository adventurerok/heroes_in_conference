import {Container} from "../Container";
import {AppActionTypes, AppObjectAction} from "../AppActions";
import {Cache} from "../Cache";
import {ContentGroup} from "../../groups/ContentGroup";

export function reduceGroupCache(state: Cache<ContentGroup> | undefined, action: AppObjectAction): Cache<ContentGroup> {
    switch (action.type) {
        case AppActionTypes.UPDATE_GROUP_CACHE: {
            // swap out the map cache for the new data
            return action.cache;
        }
        case AppActionTypes.UPDATE_CACHED_GROUP: {
            // Update Cached Map shouldn't arrive unless we have the maps from the server
            return state ? Cache.updateItem(state, action.groupId, action.group) : Container.empty();
        }
        default: {
            return state || Container.empty();
        }
    }
}