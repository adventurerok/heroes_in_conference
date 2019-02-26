import {AppThunkAction} from "../../AppActions";
import {API} from "../../../api/API";
import {updateCachedGroup} from "./UpdateCachedGroup";
import {ContentGroup} from "../../../groups/ContentGroup";


export function toggleGroup(group: ContentGroup, enabled: boolean): AppThunkAction {
    return (dispatch) => {
        API.toggleGroup(group.id, enabled)
            .then(value => {
                dispatch(updateCachedGroup({
                    ...group,
                    enabled,
                }));
            });
    }
}