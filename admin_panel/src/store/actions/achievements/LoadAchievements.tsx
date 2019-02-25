import {AppThunkAction} from "../../AppActions";
import {API} from "../../../api/API";
import {Container, ErrorState} from "../../Container";
import {IDMap} from "../../IDMap";
import {updateAchievementCache} from "./UpdateAchievementCache";


export function loadAchievements(): AppThunkAction {
    return dispatch => {

        // we have started loading
        dispatch(updateAchievementCache(Container.loading(Date.now())));

        API.getAchievements()
            .then(achies => {
                const idMapOfAchies = IDMap.fromArray(achies, achie => achie.id);
                dispatch(updateAchievementCache(Container.synced(idMapOfAchies, Date.now())));
            })
            .catch(reason => {
                const error: ErrorState = {
                    timeErrored: Date.now(),
                    tries: 1,
                    errorMsg: reason,
                    errorData: reason,
                };

                dispatch(updateAchievementCache(Container.errored(error)));
            });
    }
}