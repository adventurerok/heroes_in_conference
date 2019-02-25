import {Action} from "redux";
import {AppActionTypes} from "../../AppActions";
import {Achievement} from "../../../achievements/Achievement";
import {Cache} from "../../Cache";


export interface UpdateAchievementCacheAction extends Action<AppActionTypes> {
    type: AppActionTypes.UPDATE_ACHIEVEMENT_CACHE,
    cache: Cache<Achievement>,
}

export function updateAchievementCache(cache: Cache<Achievement>): UpdateAchievementCacheAction {
    return {
        type: AppActionTypes.UPDATE_ACHIEVEMENT_CACHE,
        cache,
    };
}