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
const ReactLeaflet = RL as any;

interface RouteParams {
    id: string,
}

interface ReduxStateProps {
    map: CacheItem<ConferenceMap>,
}

type ConnectedProps = RouteComponentProps<RouteParams>;

type Props = ConnectedProps & ReduxStateProps;

class UnconnectedMapPage extends React.Component<Props, {}> {

    public render(): React.ReactNode {
        switch(this.props.map.state) {
            case CacheItemState.CACHE_UNLOADED:
                // FIXME we should really request to load it then
                return <div>The map cache is unloaded, abort!</div>;
            case CacheItemState.CACHE_LOADING:
                return <div>Loading map...</div>;
            case CacheItemState.CACHE_ERROR:
                return <div>Error loading maps: {this.props.map.error.errorMsg}</div>;
            case CacheItemState.NOT_PRESENT:
                return <div>No maps exists with the ID, perhaps it was deleted</div>;
            case CacheItemState.PRESENT: {

                const map = this.props.map.item;
                const bounds = [[0, 0], [1000, 1000]];

                const leafletMap = <ReactLeaflet.Map crs={L.CRS.Simple} minZoom={-5} bounds={bounds}>
                    <ReactLeaflet.ImageOverlay url={process.env.PUBLIC_URL + map.path} bounds={bounds}/>
                </ReactLeaflet.Map>;

                return <>
                    <h1>Modifying Map</h1>
                    <form>
                        <div className="form-group">
                            <label htmlFor="name">Map Name</label>
                            <input type="text" className="form-control" id="name"
                                   placeholder="Event Name" value={map.name} onChange={this.mapTitleChanged}/>
                            {leafletMap}
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
    return {
        map: Cache.getItem(state.mapCache, ownProps.match.params.id),
    };
}

export const MapPage = connect(mapStateToProps)(UnconnectedMapPage);