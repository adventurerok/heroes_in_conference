import * as React from "react";
import {ChangeEvent} from "react";
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

interface State {
    map?: ConferenceMap,
    statusMessage?: string,
    revokeURL?: string,
}

class UnconnectedMapPage extends React.Component<Props, State> {


    constructor(props: Props, context: any) {
        super(props, context);

        // initial state
        this.state = {};
    }

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

        this.onUpdate();
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
        this.onUpdate();
    }

    public componentWillUnmount(): void {
        if(this.state.revokeURL) {
            // revoke the object url of a changed map
            URL.revokeObjectURL(this.state.revokeURL);
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

                if(this.state.map) {
                    return this.renderWithMap(this.state.map);
                } else {
                    return <div>Awaiting map copy</div>;
                }

            }
        }
    }

    private renderWithMap = (map: ConferenceMap) => {

        // list for the table
        let markerList = null;

        // marker elements to go on the map
        let markersOnMap = null;

        if (Container.isReady(this.props.markers)) {
            const markers = IDMap.values(this.props.markers.data).sort(MapMarker.sortByName);
            markerList = markers.map(marker => <MarkerListItem key={marker.id} marker={marker}/>);
            markersOnMap = markers.map(markerOnMap);
        }

        const bounds = [[0, 0], [1000, 1000]];

        // TODO new maps
        const isNew = false;

        let mapUrl = map.path;
        if(mapUrl.charAt(0) === "/") {
            mapUrl = process.env.PUBLIC_URL + mapUrl;
        }

        const leafletMap = <ReactLeaflet.Map crs={L.CRS.Simple} minZoom={-1} maxZoom={3} bounds={bounds}>
            <ReactLeaflet.ImageOverlay url={mapUrl} bounds={bounds}/>
            {markersOnMap}
        </ReactLeaflet.Map>;

        return <>
            <h1>Modifying Map</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="name">Map Name</label>
                    <input type="text" className="form-control" id="name"
                           placeholder="Map Name" value={map.name} onChange={this.mapTitleChanged}/>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Change Map Image</label>
                    <input type="file" className="form-control" id="image"
                           onChange={this.mapImageChanged}/>
                </div>
                <div>
                    <button type="button" className="btn btn-success mr-1" onClick={this.updateToServer}>
                        Save
                    </button>
                    <button type="button" className="btn btn-outline-info" onClick={this.backToList}>Cancel</button>
                    {!isNew &&
                    <button type="button" className="btn btn-danger float-right" onClick={this.delete}>Delete</button>}
                </div>
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
            </form>
        </>;
    };

    private onUpdate = () => {
        if(!this.state.map) {
            if(CacheItem.isPresent(this.props.map)) {
                // TODO id or new

                this.setState({
                    map: this.props.map.item,
                });
            }
        }
    };

    private mapTitleChanged = (e: ChangeEvent<HTMLInputElement>) => {
        if(!this.state.map) {
            return;
        }

        const newTitle = e.target.value;

        this.setState(state => {
            if(!state.map) {
                throw new Error("We can't change state if we haven't loaded");
            }

            return {
                map: {
                    ...state.map,
                    name: newTitle,
                },
            };
        });
    };

    private mapImageChanged = (e: ChangeEvent<HTMLInputElement>) => {
        if(!this.state.map || !e.target.files || e.target.files.length === 0) {
            return;
        }

        const url = URL.createObjectURL(e.target.files[0]);
        // TODO object url needs revoking
        console.log(url);

        this.setState(state => {
             if(!state.map) {
                 throw new Error("No more state");
             }

             if(state.revokeURL) {
                 // ensure old object url is revoked before we update the revoke url
                 URL.revokeObjectURL(state.revokeURL);
             }

             return {
                 map: {
                     ...state.map,
                     path: url,
                 },
                 revokeURL: url,
             }
        });
    };

    private updateToServer = () => {
        // TODO
    };

    private backToList = () => {
        // TODO
    };

    private delete = () => {
        // TODO
    };

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