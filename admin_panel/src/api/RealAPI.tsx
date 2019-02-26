import {API} from "./API";
import {MockAPI} from "./MockAPI";


const apiUrl = "/api";

interface APIResponse {
    status: "error" | "ok",
}

export const RealAPI: API = {
    ...MockAPI,

    login: async(password: string) => {
        const response = await fetch(`${apiUrl}/admin/authenticate?password=${password}`, {
            credentials: "include",

        });

        if(!response.ok) {
            return false;
        }

        const data = (await response.json()) as APIResponse;

        return data.status === "ok";
    }

    // getEvents: async () => {
    //
    // }
};