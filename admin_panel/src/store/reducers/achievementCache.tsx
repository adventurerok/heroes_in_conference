import {Container} from "../Container";
import {AppActionTypes, AppObjectAction} from "../AppActions";
import {Cache} from "../Cache";
import {Achievement} from "../../achievements/Achievement";

export function reduceAchievementCache(state: Cache<Achievement> | undefined, action: AppObjectAction): Cache<Achievement> {
    switch(action.type){
        case AppActionTypes.UPDATE_ACHIEVEMENT_CACHE: {
            // swap out the achievement cache for the new data
            return action.cache;
        }
        default: {
            return state || Container.empty();
        }
    }
}