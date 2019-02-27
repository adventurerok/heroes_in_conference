import {ThunkAction} from "redux-thunk";
import {AppState} from "./AppState";
import {EventsLoadedAction} from "./actions/events/EventsLoaded";
import {UpdateCachedEventAction} from "./actions/events/UpdateCachedEvent";
import {EventsLoadingAction} from "./actions/events/EventsLoading";
import {EventsLoadErrorAction} from "./actions/events/EventsLoadError";
import {UpdateCachedMapAction} from "./actions/maps/UpdateCachedMap";
import {UpdateMapCacheAction} from "./actions/maps/UpdateMapCache";
import {UpdateMarkerCacheAction} from "./actions/markers/UpdateMarkerCache";
import {UpdateCachedMarkersAction} from "./actions/markers/UpdateCachedMarkers";
import {SetLoginStateAction} from "./actions/login/SetLoginState";
import {UpdateAchievementCacheAction} from "./actions/achievements/UpdateAchievementCache";
import {UpdateCachedGroupAction} from "./actions/groups/UpdateCachedGroup";
import {UpdateGroupCacheAction} from "./actions/groups/UpdateGroupCache";

// these are the values the type field of the action can take
export enum AppActionTypes {
    EVENTS_LOADED = "EVENTS_LOADED",
    UPDATE_EVENT = "UPDATE_EVENT",
    EVENTS_LOADING = "EVENTS_LOADING",
    EVENTS_LOAD_ERROR = "EVENTS_LOAD_ERROR",

    UPDATE_MAP_CACHE = "UPDATE_MAP_CACHE",
    UPDATE_CACHED_MAP = "UPDATE_CACHED_MAP",

    UPDATE_MARKER_CACHE = "UPDATE_MARKER_CACHE",
    UPDATE_CACHED_MARKERS = "UPDATE_CACHED_MARKER",

    UPDATE_ACHIEVEMENT_CACHE = "UPDATE_ACHIEVEMENT_CACHE",

    SET_LOGIN_STATE = "SET_LOGIN_STATE",

    UPDATE_GROUP_CACHE = "UPDATE_GROUP_CACHE",
    UPDATE_CACHED_GROUP = "UPDATE_CACHED_GROUP",
}


// this way TypeScript can infer the type of an action from its "type" field
type EventAction =
    EventsLoadedAction
    | UpdateCachedEventAction
    | EventsLoadingAction
    | EventsLoadErrorAction
    ;

type MapAction =
    UpdateCachedMapAction
    | UpdateMapCacheAction
    ;

type MarkerAction =
    UpdateCachedMarkersAction
    | UpdateMarkerCacheAction
    ;

type AchievementAction =
    UpdateAchievementCacheAction
    ;

type GroupAction =
    UpdateCachedGroupAction
    | UpdateGroupCacheAction
    ;

export type AppObjectAction =
    EventAction
    | MapAction
    | MarkerAction
    | AchievementAction
    | GroupAction
    | SetLoginStateAction;

// type of our redux-thunk actions. Type params = thunk return type, state type, enhancer, 'object' action type
export type AppThunkAction = ThunkAction<any, AppState, any, AppObjectAction>;

// an app action can be an "object" action or a "thunk" (function) action
export type AppAction = AppObjectAction | AppThunkAction;