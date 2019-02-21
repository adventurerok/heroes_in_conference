
export interface ConferenceMap {
    id: string,
    name: string,
    path: string, // path to image
}


function sortByName(a: ConferenceMap, b: ConferenceMap): number {
    return a.name.localeCompare(b.name);
}

/**
 * Give a validation error message, or null if the map is ok
 */
function validationMessage(map: ConferenceMap): string | null {
    if(!map.name) {
        return "Map's name must not be empty";
    }

    // the map is fine
    return null;
}

export const ConferenceMap = {
    sortByName,
    validationMessage,
};