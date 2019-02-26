import {Action} from "redux";
import {AppActionTypes} from "../../AppActions";
import {LoginState} from "../../LoginState";

export interface SetLoginStateAction extends Action<AppActionTypes> {
    type: AppActionTypes.SET_LOGIN_STATE,
    state: LoginState,
}

export function setLoginState(state: LoginState): SetLoginStateAction {
    return {
        type: AppActionTypes.SET_LOGIN_STATE,
        state,
    };
}