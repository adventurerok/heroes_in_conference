import {AppThunkAction} from "../../AppActions";
import {updateUsageStats} from "./UpdateUsageStats";
import {Container, ErrorState} from "../../Container";
import {API} from "../../../api/API";


export function loadUsageStats(): AppThunkAction {
    return (dispatch) => {

        dispatch(updateUsageStats(Container.loading(Date.now())));

        API.getUsageStats()
            .then(value => {
                dispatch(updateUsageStats(Container.synced(value, Date.now())))
            })
            .catch(reason => {
                const error: ErrorState = {
                    errorData: reason,
                    errorMsg: reason,
                    tries: 1,
                    timeErrored: Date.now(),
                };

                dispatch(updateUsageStats(Container.errored(error)));
            });
    };
}