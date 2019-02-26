import {API} from "./API";
import {MockAPI} from "./MockAPI";
import {Event} from "../events/Event";


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
}

function convertServerToClientEvent(input: ServerEvent): Event {
    return {
        id: input.id,
        name: input.name,
        description: input.desc,
        startTime: convertServerTime(input.start),
        endTime: convertServerTime(input.end),
    }
}

async function doFetch<T>(url: string): Promise<APIResponse<T>> {
    const response = await fetch(url, {
        credentials: "include",
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
    ...MockAPI,

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

    updateEvent: async (event: Event) => {
        const name = encodeURIComponent(event.name);
        const desc = encodeURIComponent(event.description);
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
        const response : APIResponse<ServerEvent[]> = await doFetch(`${apiUrl}/events`);

        return response.payload.map(convertServerToClientEvent);
    },

    deleteEvent: async (id: string) => {
        await doFetch(`${apiUrl}/admin/events/remove/${id}`);
    }

};