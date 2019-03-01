import {API} from "./API";
import {Event} from "../events/Event";
import {ConferenceMap} from "../maps/ConferenceMap";
import {MapMarker} from "../maps/MapMarker";
import {Achievement} from "../achievements/Achievement";
import {ContentGroup} from "../groups/ContentGroup";
import {UsageStat} from "../stats/UsageStat";


const apiUrl = "/api";

interface APIResponse<T> {
    status: "error" | "ok",
    error?: string,
    payload: T,
}

interface ServerTime {
    seconds: number,
}

interface ServerEvent {
    id: string,
    name: string,
    desc: string,
    start: ServerTime,
    end: ServerTime,
    count: number,
}

function convertServerToClientEvent(input: ServerEvent): Event {
    return {
        id: input.id.toString(),
        name: input.name,
        description: input.desc,
        startTime: convertServerTime(input.start),
        endTime: convertServerTime(input.end),
        count: input.count,
    }
}

interface ServerMap {
    id: string,
    name: string,
    image: string,
}

function convertServerToClientMap(input: ServerMap): ConferenceMap {
    let path = input.image;
    if (!path.startsWith("/")) {
        path = `/${path}`;
    }

    return {
        id: input.id.toString(),
        name: input.name,
        path,
    };
}

interface ServerMarker {
    id: string,
    map: string,
    name: string,
    desc: string,
    x: number,
    y: number,
}

function convertServerToClientMarker(input: ServerMarker): MapMarker {
    return {
        id: input.id.toString(),
        mapId: input.map.toString(),
        name: input.name,
        description: input.desc,
        pos: {
            x: input.x,
            y: input.y,
        },
    };
}

interface ServerAchievement {
    id: string,
    name: string,
    reward: number,
    count: number,
}

function convertServerToClientAchievement(input: ServerAchievement): Achievement {
    return {
        id: input.id.toString(),
        name: input.name,
        count: input.count,
    }
}

interface ServerGroup {
    id: string,
    enabled: boolean,
    name: string,
}

function convertServerToClientGroup(input: ServerGroup): ContentGroup {
    return {
        id: input.id.toString(),
        name: input.name,
        enabled: input.enabled,
    }
}

function encodeString(str: string) {
    return encodeURIComponent(str.replace("!", "!!").replace("/", "!slash"));
}

interface ServerStat {
    time: ServerTime,
    requestCount: number,
}

function convertServerToClientStat(input: ServerStat): UsageStat {
    return {
        time: convertServerTime(input.time),
        requestCount: input.requestCount,
    }
}

async function doFetch<T>(url: string, extra?: RequestInit): Promise<APIResponse<T>> {
    console.log(`doFetch ${url}`);
    const response = await fetch(url, {
        credentials: "include",
        ...extra,
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const data = (await response.json()) as APIResponse<T>;
    if (data.status !== "ok") {
        throw new Error(data.error);
    }

    return data;
}


function convertServerTime(input: ServerTime): number {
    // convert to ms
    return input.seconds * 1000;
}

export const RealAPI: API = {

    login: async (password: string) => {
        const response = await fetch(`${apiUrl}/admin/authenticate?password=${password}`, {
            credentials: "include",

        });

        if (!response.ok) {
            return false;
        }

        const data = (await response.json()) as APIResponse<{}>;

        return data.status === "ok";
    },

    checkLoggedIn: async () => {
        const response = await fetch(`${apiUrl}/admin/authenticate`, {
            credentials: "include",
        });

        if (!response.ok) {
            return false;
        }

        const data = (await response.json()) as APIResponse<{}>;
        return data.status === "ok";
    },

    updateEvent: async (event: Event) => {
        const name = encodeString(event.name);
        const desc = encodeString(event.description || " "); // we can't send empty description
        const start = Math.floor(event.startTime / 1000.0);
        const end = Math.floor(event.endTime / 1000.0);
        if (event.id === "new") {

            const response: APIResponse<Event> = await doFetch(`${apiUrl}/admin/events/create/${name}/${desc}/${start}/${end}`);

            return {
                ...event,
                id: response.payload.id,
            };
        } else {
            await doFetch(`${apiUrl}/admin/events/update/${event.id}/${name}/${desc}/${start}/${end}`);

            return event;
        }
    },

    getEvents: async () => {
        const response: APIResponse<ServerEvent[]> = await doFetch(`${apiUrl}/events`);

        return response.payload.map(convertServerToClientEvent);
    },

    deleteEvent: async (id: string) => {
        await doFetch(`${apiUrl}/admin/events/remove/${id}`);
    },

    updateMap: async (map: ConferenceMap, image?: Blob) => {
        const name = encodeString(map.name);

        let formData;
        if (image) {
            formData = new FormData();
            formData.append('image', image, 'imgfile.jpg');
        }

        if (map.id === "new") {
            if (!image) {
                throw new Error("Expecting image for new map");
            }
            const response: APIResponse<ServerMap> = await doFetch(`${apiUrl}/admin/maps/create/${name}`, {
                method: 'POST',
                body: formData,
            });

            return convertServerToClientMap(response.payload);
        } else {
            const renamePromise: Promise<APIResponse<void>> = doFetch(`${apiUrl}/admin/maps/rename/${map.id}/${name}`);

            if (image) {
                // do both requests at once
                const maps = await Promise.all([
                    renamePromise,
                    doFetch(`${apiUrl}/admin/maps/setimage/${map.id}`, {
                        method: 'POST',
                        body: formData,
                    }) as Promise<APIResponse<ServerMap>>
                ]);

                return convertServerToClientMap(maps[1].payload);
            } else {
                await renamePromise;
                return map;
            }


        }
    },

    getMaps: async () => {
        const response: APIResponse<ServerMap[]> = await doFetch(`${apiUrl}/maps`);

        return response.payload.map(convertServerToClientMap);
    },

    deleteMap: async (id: string) => {
        await doFetch(`${apiUrl}/admin/maps/remove/${id}`);
    },

    createMapMarker: async (mapId, pos) => {
        const name = encodeString("New Marker");
        const desc = encodeString(" ");
        const x = Math.floor(pos.x);
        const y = Math.floor(pos.y);

        const response: APIResponse<ServerMarker> = await doFetch(`${apiUrl}/admin/maps/mark/${mapId}/${name}/${desc}/${x}/${y}`);

        return convertServerToClientMarker(response.payload);
    },

    updateMapMarkers: async (modifiedMarkers, deletedMarkers) => {
        console.log("Update map markers");

        const updatePromises = modifiedMarkers.map(value => {
            const name = encodeString(value.name);
            const desc = encodeString(value.description || " ");
            const x = Math.round(value.pos.x);
            const y = Math.round(value.pos.y);
            return doFetch(`${apiUrl}/admin/markers/update/${value.id}/${name}/${desc}/${x}/${y}`);
        });

        const deletePromises = deletedMarkers.map(value => {
            return doFetch(`${apiUrl}/admin/markers/remove/${value}`);
        });

        const combined = [...updatePromises, ...deletePromises];
        await Promise.all(combined);
    },

    getMapMarkers: async (mapId: string) => {
        if (mapId === "new") {
            return [];
        }

        const markers: APIResponse<ServerMarker[]> = await doFetch(`${apiUrl}/markers/${mapId}`);

        return markers.payload.map(convertServerToClientMarker);
    },

    getAchievements: async () => {
        const response: APIResponse<ServerAchievement[]> = await doFetch(`${apiUrl}/achievements`);

        return response.payload.map(convertServerToClientAchievement);
    },

    getGroups: async () => {
        const response: APIResponse<ServerGroup[]> = await doFetch(`${apiUrl}/groups`);

        return response.payload.map(convertServerToClientGroup);
    },

    toggleGroup: async (groupId: string, enabled: boolean) => {
        const enableOrDisable = enabled ? "enable" : "disable";

        await doFetch(`${apiUrl}/admin/groups/${groupId}/${enableOrDisable}`);
    },

    getUsageStats: async () => {
        const response : APIResponse<ServerStat[]> = await doFetch(`${apiUrl}/admin/usage`);

        return response.payload.map(convertServerToClientStat);
    },

    getUserCount: async () => {
        const response : APIResponse<number> = await doFetch(`${apiUrl}/admin/users`);

        return response.payload;
    }

};