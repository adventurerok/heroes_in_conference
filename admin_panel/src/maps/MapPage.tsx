import * as React from "react";
import {ConferenceMap} from "./ConferenceMap";
import {connect} from "react-redux";
import {AppState} from "../store/AppState";
import {RouteComponentProps} from "react-router";
import {Cache, CacheItem, CacheItemState} from "../store/Cache";
import * as L from "leaflet";
// no types for react-leaflet
// @ts-ignore
import * as RL from 'react-leaflet';
import {MapMarker} from "./MapMarker";
import {AppDispatch} from "../store/appStore";
import {loadMaps} from "../store/actions/maps/LoadMaps";
import {loadMarkers} from "../store/actions/markers/LoadMarkers";
import {Container} from "../store/Container";
import {IDMap} from "../store/IDMap";

const ReactLeaflet = RL as any;

interface RouteParams {
    id: string,
}

interface ReduxStateProps {
    map: CacheItem<ConferenceMap>,
    markers: Cache<MapMarker>,
}

interface ReduxDispatchProps {
    loadMaps: () => void,
    loadMarkers: () => void,
}

type ConnectedProps = RouteComponentProps<RouteParams>;

type Props = ConnectedProps & ReduxStateProps & ReduxDispatchProps;

class UnconnectedMapPage extends React.Component<Props, {}> {

    public componentDidMount(): void {

        // ensure the map is loaded
        switch (this.props.map.state) {
            case CacheItemState.CACHE_UNLOADED:
            case CacheItemState.CACHE_ERROR:
                this.props.loadMaps();
        }

        // ensure the markers are loaded
        if (Container.isEmpty(this.props.markers) || Container.isErrored(this.props.markers)) {
            this.props.loadMarkers();
        }
    }

    public render(): React.ReactNode {
        switch (this.props.map.state) {
            case CacheItemState.CACHE_UNLOADED:
                return <div>The map cache is unloaded, abort!</div>;
            case CacheItemState.CACHE_LOADING:
                return <div>Loading map...</div>;
            case CacheItemState.CACHE_ERROR:
                return <div>Error loading maps: {this.props.map.error.errorMsg}</div>;
            case CacheItemState.NOT_PRESENT:
                return <div>No maps exists with the ID, perhaps it was deleted</div>;
            case CacheItemState.PRESENT: {

                const map = this.props.map.item;


                let markerList = null;
                let markersOnMap = null;

                if (Container.isReady(this.props.markers)) {
                    const markers = IDMap.values(this.props.markers.data).sort(MapMarker.sortByName);
                    markerList = markers.map(marker => <MarkerListItem key={marker.id} marker={marker}/>);
                    markersOnMap = markers.map(markerOnMap);
                }

                const bounds = [[0, 0], [1000, 1000]];

                const leafletMap = <ReactLeaflet.Map crs={L.CRS.Simple} minZoom={-5} bounds={bounds}>
                    <ReactLeaflet.ImageOverlay url={process.env.PUBLIC_URL + map.path} bounds={bounds}/>
                    {markersOnMap}
                </ReactLeaflet.Map>;

                return <>
                    <h1>Modifying Map</h1>
                    <form>
                        <div className="form-group">
                            <label htmlFor="name">Map Name</label>
                            <input type="text" className="form-control" id="name"
                                   placeholder="Event Name" value={map.name} onChange={this.mapTitleChanged}/>
                            <br/>
                            {leafletMap}
                            <br/>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Desc</th>
                                </tr>
                                </thead>
                                <tbody>
                                {markerList}
                                </tbody>
                            </table>
                        </div>
                    </form>
                </>;
            }
        }


    }

    private mapTitleChanged = () => {
        // TODO
    }

}

function mapStateToProps(state: AppState, ownProps: ConnectedProps): ReduxStateProps {
    const mapId = ownProps.match.params.id;

    return {
        map: Cache.getItem(state.mapCache, mapId),
        markers: Cache.filter(state.markerCache, item => item.mapId === mapId),
    };
}

function mapDispatchToProps(dispatch: AppDispatch): ReduxDispatchProps {
    return {
        loadMaps: () => dispatch(loadMaps()),
        loadMarkers: () => dispatch(loadMarkers()),
    }
}

export const MapPage = connect(mapStateToProps, mapDispatchToProps)(UnconnectedMapPage);

interface MarkerListItemProps {
    marker: MapMarker,
}

class MarkerListItem extends React.Component<MarkerListItemProps, {}> {

    public render(): React.ReactNode {
        return <tr>
            <td>{this.props.marker.name}</td>
            <td>{this.props.marker.description}</td>
        </tr>;
    }
}

function markerOnMap(marker: MapMarker) {
    // northing = y, easting = x,
    const pos = [marker.pos.y, marker.pos.x];

    return <ReactLeaflet.Marker position={pos}>
        <ReactLeaflet.Popup>
            {marker.description}
        </ReactLeaflet.Popup>
    </ReactLeaflet.Marker>;
}