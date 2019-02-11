
export interface ConferenceMap {
    id: string,
    name: string,
    path: string, // path to image
}


function sortByName(a: ConferenceMap, b: ConferenceMap): number {
    return a.name.localeCompare(b.name);
}

export const ConferenceMap = {
    sortByName,
};