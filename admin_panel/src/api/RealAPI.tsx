import {API} from "./API";
import {MockAPI} from "./MockAPI";


// const apiUrl = "https://36823ac6.ngrok.io/api";

export const RealAPI: API = {
    ...MockAPI,

    // getEvents: async () => {
    //
    // }
};