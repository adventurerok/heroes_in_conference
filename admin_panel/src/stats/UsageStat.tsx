export interface UsageStat {
    time: number,
    requestCount: number,
}

function sort(a: UsageStat, b: UsageStat): number {
    if (b.time > a.time) {
        return -1;
    } else if (b.time < a.time) {
        return 1;
    } else {
        return 0;
    }
}

export const UsageStat = {
    sort,
};