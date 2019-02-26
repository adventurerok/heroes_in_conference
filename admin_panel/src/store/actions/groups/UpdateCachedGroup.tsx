import {AppActionTypes} from "../../AppActions";
import {Action} from "redux";
import {ContentGroup} from "../../../groups/ContentGroup";


export interface UpdateCachedGroupAction extends Action<AppActionTypes> {
    type: AppActionTypes.UPDATE_CACHED_GROUP,
    groupId: string,
    group: ContentGroup | null, // null for deleted
}

export function updateCachedGroup(group: ContentGroup | null, groupId?: string): UpdateCachedGroupAction {
    let id = groupId;

    if(!id && group) {
        id = group.id;
    }

    if(!id) {
        throw new Error("No map id provided to updateCachedMap");
    }

    return {
        type: AppActionTypes.UPDATE_CACHED_GROUP,
        groupId: id,
        group,
    };
}