import {Action} from "redux";
import {AppActionTypes} from "../../AppActions";
import {IDMap} from "../../IDMap";
import {Container} from "../../Container";
import {ContentGroup} from "../../../groups/ContentGroup";


export interface UpdateGroupCacheAction extends Action<AppActionTypes> {
    type: AppActionTypes.UPDATE_GROUP_CACHE,
    cache: Container<IDMap<ContentGroup>>,
}

export function updateGroupCache(cache: Container<IDMap<ContentGroup>>): UpdateGroupCacheAction {
    return {
        type: AppActionTypes.UPDATE_GROUP_CACHE,
        cache,
    };
}