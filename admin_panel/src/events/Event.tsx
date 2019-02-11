import {compareAsc, differenceInMilliseconds} from 'date-fns';
import * as uuidv4 from 'uuid/v4';

// working with ms since epoch is easiest
export type DateTime = number;

export interface Event {
    id: string,
    name: string,
    description: string,
    location?: string, // just a string for now, e.g. "LT1", which would then link to map marker
    startTime: DateTime,
    endTime: DateTime
}

/**
 * Sort events by which starts first, then which is longest, then their names
 */
function sortStartTime(a: Event, b: Event): number {
    const compareStarts = compareAsc(a.startTime, b.startTime);
    if (compareStarts !== 0) {
        return compareStarts;
    }

    // later date goes before earlier date
    const lengthA = differenceInMilliseconds(a.endTime, a.startTime);
    const lengthB = differenceInMilliseconds(b.endTime, b.startTime);

    if (lengthA > lengthB) {
        return -1;
    } else if (lengthA < lengthB) {
        return 1;
    } else {
        return a.name.localeCompare(b.name);
    }
}

function create(): Event {
    const id = uuidv4();

    return {
        id,
        name: "",
        description: "",
        startTime: Date.now(),
        endTime: Date.now()
    };
}

export const Event = {
    sortStartTime,
    create
};