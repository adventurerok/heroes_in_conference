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
    switch (c.state) {
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
            if (c.data[id]) {
                return presentCacheItem(c.data[id]);
            } else {
                return notPresentCacheItem();
            }
        }
    }
}

/**
 * Updates the cache for the item at the specified id.
 *
 */
function updateItem<T>(c: Cache<T>, id: string, item: T | null): Cache<T> {
    if (!Container.isReady(c)) {
        // cache cannot be updated
        return c;
    }

    const data = {...c.data};
    if (item !== null) {
        data[id] = item;
    } else {
        delete data[id];
    }

    // we use modified containers for this so that synced containers mean we have just read all items fro the server
    return Container.modified(data, Date.now());
}

function buildCache<T>(items: IDMap<T>): Cache<T> {
    return Container.synced(items, Date.now());
}

// filter a cache to include only the items we want
function filter<T>(c: Cache<T>, func: (item: T, id: string) => boolean): Cache<T> {
    if (!Container.isReady(c)) {
        // result is not ready
        return c;
    }

    const data = c.data;
    const resultData: IDMap<T> = {};

    for (const id in data) {
        if (!data.hasOwnProperty(id)) {
            continue;
        }

        const item = data[id];

        if (func(item, id)) {
            resultData[id] = item;
        }
    }

    // Give back the same type of container
    if(Container.isModified(c)) {
        return Container.modified(resultData, c.modified, c.error);
    } else {
        return Container.synced(resultData, c.modified);
    }
}

export const Cache = {
    isUnloaded: Container.isEmpty,
    isLoading: Container.isLoading,
    isLoaded: Container.isReady,
    getItem,
    updateItem,
    buildCache,
    filter,
};