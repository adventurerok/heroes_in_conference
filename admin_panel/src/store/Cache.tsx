import {IDMap} from "./IDMap";
import {Container, ContainerState, ErrorState} from "./Container";


export enum CacheItemState {
    CACHE_UNLOADED,
    CACHE_LOADING,
    CACHE_ERROR,
    NOT_PRESENT,
    PRESENT,
}

export interface UnloadedCacheItem {
    state: CacheItemState.CACHE_UNLOADED,
}

function unloadedCacheItem(): UnloadedCacheItem {
    return {
        state: CacheItemState.CACHE_UNLOADED,
    }
}

export interface LoadingCacheItem {
    state: CacheItemState.CACHE_LOADING,
    timeStartedLoading: number,
}

function loadingCacheItem(timeStartedLoading: number): LoadingCacheItem {
    return {
        state: CacheItemState.CACHE_LOADING,
        timeStartedLoading,
    }
}

export interface ErroredCacheItem {
    state: CacheItemState.CACHE_ERROR,
    error: ErrorState,
}

function erroredCacheItem(error: ErrorState): ErroredCacheItem {
    return {
        state: CacheItemState.CACHE_ERROR,
        error,
    }
}

export interface NotPresentCacheItem {
    state: CacheItemState.NOT_PRESENT,
}

function notPresentCacheItem(): NotPresentCacheItem {
    return {
        state: CacheItemState.NOT_PRESENT,
    }
}

export interface PresentCacheItem<T> {
    state: CacheItemState.PRESENT,
    item: T,
}

function presentCacheItem<T>(item: T): PresentCacheItem<T> {
    return {
        state: CacheItemState.PRESENT,
        item,
    }
}

export type CacheItem<T> =
    UnloadedCacheItem
    | LoadingCacheItem
    | ErroredCacheItem
    | NotPresentCacheItem
    | PresentCacheItem<T>;

function isUnloaded<T>(c: CacheItem<T>): c is UnloadedCacheItem {
    return c.state === CacheItemState.CACHE_UNLOADED;
}

function isLoading<T>(c: CacheItem<T>): c is LoadingCacheItem {
    return c.state === CacheItemState.CACHE_LOADING;
}

function isErrored<T>(c: CacheItem<T>): c is ErroredCacheItem {
    return c.state === CacheItemState.CACHE_ERROR;
}

function isNotPresent<T>(c: CacheItem<T>): c is NotPresentCacheItem {
    return c.state === CacheItemState.NOT_PRESENT;
}

function isPresent<T>(c: CacheItem<T>): c is PresentCacheItem<T> {
    return c.state === CacheItemState.PRESENT;
}

export const CacheItem = {
    isUnloaded,
    isLoading,
    isErrored,
    isNotPresent,
    isPresent
};

export type Cache<T> = Container<IDMap<T>>;

/**
 *  Extract an item from the cache
 */
function getItem<T>(c: Cache<T>, id: string): CacheItem<T> {
    switch(c.state) {
        case ContainerState.EMPTY: {
            return unloadedCacheItem();
        }
        case ContainerState.LOADING: {
            return loadingCacheItem(c.timeStartedLoading);
        }
        case ContainerState.ERRORED: {
            return erroredCacheItem(c.error);
        }
        case ContainerState.SYNCED:
        case ContainerState.MODIFIED: {
            if(c.data[id]) {
                return presentCacheItem(c.data[id]);
            } else {
                return notPresentCacheItem();
            }
        }
    }
}

export const Cache = {
    isUnloaded: Container.isEmpty,
    isLoading: Container.isLoading,
    isLoaded: Container.isReady,
    getItem,
};