import {AppThunkAction} from "../../AppActions";
import {API} from "../../../api/API";
import {setLoginState} from "./SetLoginState";
import {LoginState} from "../../LoginState";


export function checkLoginState(): AppThunkAction {
    return dispatch => {
        dispatch(setLoginState(LoginState.CHECKING_COOKIE));

        API.checkLoggedIn()
            .then(value => {
                if(value) {
                    dispatch(setLoginState(LoginState.LOGGED_IN));
                } else {
                    dispatch(setLoginState(LoginState.NOT_LOGGED_IN));
                }
            })
            .catch(reason => {
                dispatch(setLoginState(LoginState.NOT_LOGGED_IN));
            })
    }
}