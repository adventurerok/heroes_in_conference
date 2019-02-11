
export interface GridPos {
    x: number,
    y: number,
}

export interface MapMarker {
    id: string,
    mapId: string,

    name: string,
    description: string,

    pos: GridPos,

}

/**
 * Gives a function that returns true iff the marker provided has the given map id
 */
function filterOnMapId(id: string): (mark: MapMarker) => boolean {
    return (mark) => {
        return mark.mapId === id;
    };
}

export const MapMarker = {
    filterOnMapId,
};