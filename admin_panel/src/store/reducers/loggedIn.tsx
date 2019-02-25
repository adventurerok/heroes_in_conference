import {LoginState} from "../LoginState";
import {AppActionTypes, AppObjectAction} from "../AppActions";


export function reduceLoggedIn(state: LoginState | undefined, action: AppObjectAction): LoginState {
    switch(action.type) {
        case AppActionTypes.SET_LOGIN_STATE: {
            return action.state;
        }
        default: {
            if(state) {
                return state;
            } else if(document.cookie) {
                return LoginState.UNCHECKED_COOKIE;
            } else {
                return LoginState.NOT_LOGGED_IN;
            }
        }
    }
}