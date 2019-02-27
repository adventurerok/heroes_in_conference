import {UsageStat} from "../../stats/UsageStat";
import {Container} from "../Container";
import {AppActionTypes, AppObjectAction} from "../AppActions";

export function reduceUsageStats(state: Container<UsageStat[]> | undefined, action: AppObjectAction): Container<UsageStat[]> {
    switch(action.type){
        case AppActionTypes.UPDATE_USAGE_STATS: {
            return action.usageStats;
        }
        default: {
            return state || Container.empty();
        }
    }
}