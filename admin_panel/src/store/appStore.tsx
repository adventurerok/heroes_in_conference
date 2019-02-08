import {applyMiddleware, createStore} from 'redux';
import {AppState} from "./AppState";
import {AppObjectAction} from "./AppActions";
import thunk from "redux-thunk";
import {appReducer} from "./appReducer";


export const appStore = createStore<AppState, AppObjectAction, {}, {}>(appReducer, {}, applyMiddleware(thunk));