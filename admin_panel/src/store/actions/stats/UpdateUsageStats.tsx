import {Action} from "redux";
import {AppActionTypes} from "../../AppActions";
import {Container} from "../../Container";
import {UsageStat} from "../../../stats/UsageStat";

export interface UpdateUsageStatsAction extends Action<AppActionTypes> {
    type: AppActionTypes.UPDATE_USAGE_STATS,
    usageStats: Container<UsageStat[]>,
}

export function updateUsageStats(stats: Container<UsageStat[]>): UpdateUsageStatsAction {
    return {
        type: AppActionTypes.UPDATE_USAGE_STATS,
        usageStats: stats,
    };
}